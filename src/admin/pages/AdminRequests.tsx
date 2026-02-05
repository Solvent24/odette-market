 import { useEffect, useState } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { useLanguage } from "@/hooks/useLanguage";
 import { useToast } from "@/hooks/use-toast";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { Input } from "@/components/ui/input";
 import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
 } from "@/components/ui/alert-dialog";
 import { Search, UserCheck, UserX, Clock, CheckCircle, XCircle } from "lucide-react";
 
 interface AdminRequest {
   id: string;
   user_id: string;
   email: string;
   full_name: string | null;
   reason: string | null;
   status: string;
   created_at: string;
   reviewed_at: string | null;
 }
 
 const AdminRequests = () => {
   const { language } = useLanguage();
   const { toast } = useToast();
   const [requests, setRequests] = useState<AdminRequest[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null);
   const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
   const [processing, setProcessing] = useState(false);
 
   useEffect(() => {
     fetchRequests();
   }, []);
 
   const fetchRequests = async () => {
     try {
       const { data, error } = await supabase
         .from("admin_requests")
         .select("*")
         .order("created_at", { ascending: false });
 
       if (error) throw error;
       setRequests(data || []);
     } catch (error) {
       console.error("Error fetching requests:", error);
     } finally {
       setLoading(false);
     }
   };
 
   const handleAction = async () => {
     if (!selectedRequest || !actionType) return;
     
     setProcessing(true);
     try {
       const { data: { user } } = await supabase.auth.getUser();
       
       // Update request status
       const { error: updateError } = await supabase
         .from("admin_requests")
         .update({
           status: actionType === "approve" ? "approved" : "rejected",
           reviewed_by: user?.id,
           reviewed_at: new Date().toISOString(),
         })
         .eq("id", selectedRequest.id);
 
       if (updateError) throw updateError;
 
       // If approved, add admin role
       if (actionType === "approve") {
         const { error: roleError } = await supabase
           .from("user_roles")
           .update({ role: "admin" })
           .eq("user_id", selectedRequest.user_id);
 
         if (roleError) throw roleError;
       }
 
       toast({
         title: language === "rw" ? "Byagenze neza!" : "Success!",
         description: actionType === "approve"
           ? (language === "rw" ? "Admin yemejwe" : "Admin approved successfully")
           : (language === "rw" ? "Ubusabe bwanzwe" : "Request rejected"),
       });
 
       fetchRequests();
     } catch (error: any) {
       console.error("Error processing request:", error);
       toast({
         title: language === "rw" ? "Ikosa" : "Error",
         description: error.message,
         variant: "destructive",
       });
     } finally {
       setProcessing(false);
       setSelectedRequest(null);
       setActionType(null);
     }
   };
 
   const filteredRequests = requests.filter(
     (r) =>
       r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       r.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
   );
 
   const pendingCount = requests.filter((r) => r.status === "pending").length;
 
   const t = {
     title: language === "rw" ? "Ubusabe bw'Admin" : "Admin Requests",
     subtitle: language === "rw" 
       ? "Gucunga ubusabe bwo kuba admin" 
       : "Manage admin access requests",
     search: language === "rw" ? "Shakisha..." : "Search...",
     pending: language === "rw" ? "Bitegereje" : "Pending",
     approved: language === "rw" ? "Byemejwe" : "Approved",
     rejected: language === "rw" ? "Byanzwe" : "Rejected",
     user: language === "rw" ? "Umukoresha" : "User",
     reason: language === "rw" ? "Impamvu" : "Reason",
     status: language === "rw" ? "Imimerere" : "Status",
     date: language === "rw" ? "Itariki" : "Date",
     actions: language === "rw" ? "Ibikorwa" : "Actions",
     approve: language === "rw" ? "Emeza" : "Approve",
     reject: language === "rw" ? "Anga" : "Reject",
     noRequests: language === "rw" ? "Nta busabe buhari" : "No requests found",
     confirmApprove: language === "rw" 
       ? "Uremeza ko ushaka gutanga uburenganzira bw'admin kuri" 
       : "Are you sure you want to grant admin access to",
     confirmReject: language === "rw" 
       ? "Uremeza ko ushaka kwanga ubusabe bwa" 
       : "Are you sure you want to reject the request from",
     cancel: language === "rw" ? "Hagarika" : "Cancel",
     confirm: language === "rw" ? "Emeza" : "Confirm",
   };
 
   const getStatusBadge = (status: string) => {
     switch (status) {
       case "pending":
         return (
           <Badge variant="secondary" className="gap-1">
             <Clock className="h-3 w-3" />
             {t.pending}
           </Badge>
         );
       case "approved":
         return (
           <Badge variant="default" className="gap-1 bg-green-600">
             <CheckCircle className="h-3 w-3" />
             {t.approved}
           </Badge>
         );
       case "rejected":
         return (
           <Badge variant="destructive" className="gap-1">
             <XCircle className="h-3 w-3" />
             {t.rejected}
           </Badge>
         );
       default:
         return <Badge>{status}</Badge>;
     }
   };
 
   if (loading) {
     return (
       <div className="flex justify-center py-12">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
       </div>
     );
   }
 
   return (
     <div className="space-y-6">
       <div>
         <h1 className="text-2xl md:text-3xl font-display font-bold">{t.title}</h1>
         <p className="text-muted-foreground mt-1">{t.subtitle}</p>
       </div>
 
       <Card>
         <CardHeader>
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
               <CardTitle>{t.title}</CardTitle>
               {pendingCount > 0 && (
                 <Badge variant="destructive">{pendingCount} {t.pending}</Badge>
               )}
             </div>
             <div className="relative w-full sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 placeholder={t.search}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-10"
               />
             </div>
           </div>
         </CardHeader>
         <CardContent>
           <div className="overflow-x-auto">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>{t.user}</TableHead>
                   <TableHead className="hidden md:table-cell">{t.reason}</TableHead>
                   <TableHead>{t.status}</TableHead>
                   <TableHead className="hidden sm:table-cell">{t.date}</TableHead>
                   <TableHead>{t.actions}</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredRequests.length === 0 ? (
                   <TableRow>
                     <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                       {t.noRequests}
                     </TableCell>
                   </TableRow>
                 ) : (
                   filteredRequests.map((request) => (
                     <TableRow key={request.id}>
                       <TableCell>
                         <div>
                           <p className="font-medium">{request.full_name || "—"}</p>
                           <p className="text-sm text-muted-foreground">{request.email}</p>
                         </div>
                       </TableCell>
                       <TableCell className="hidden md:table-cell max-w-[200px]">
                         <p className="truncate text-sm text-muted-foreground">
                           {request.reason || "—"}
                         </p>
                       </TableCell>
                       <TableCell>{getStatusBadge(request.status)}</TableCell>
                       <TableCell className="hidden sm:table-cell text-muted-foreground">
                         {new Date(request.created_at).toLocaleDateString()}
                       </TableCell>
                       <TableCell>
                         {request.status === "pending" && (
                           <div className="flex gap-2">
                             <Button
                               size="sm"
                               variant="default"
                               className="gap-1"
                               onClick={() => {
                                 setSelectedRequest(request);
                                 setActionType("approve");
                               }}
                             >
                               <UserCheck className="h-4 w-4" />
                               <span className="hidden sm:inline">{t.approve}</span>
                             </Button>
                             <Button
                               size="sm"
                               variant="destructive"
                               className="gap-1"
                               onClick={() => {
                                 setSelectedRequest(request);
                                 setActionType("reject");
                               }}
                             >
                               <UserX className="h-4 w-4" />
                               <span className="hidden sm:inline">{t.reject}</span>
                             </Button>
                           </div>
                         )}
                       </TableCell>
                     </TableRow>
                   ))
                 )}
               </TableBody>
             </Table>
           </div>
         </CardContent>
       </Card>
 
       <AlertDialog open={!!selectedRequest && !!actionType} onOpenChange={() => {
         setSelectedRequest(null);
         setActionType(null);
       }}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>
               {actionType === "approve" ? t.approve : t.reject}
             </AlertDialogTitle>
             <AlertDialogDescription>
               {actionType === "approve" ? t.confirmApprove : t.confirmReject}{" "}
               <strong>{selectedRequest?.full_name || selectedRequest?.email}</strong>?
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel disabled={processing}>{t.cancel}</AlertDialogCancel>
             <AlertDialogAction
               onClick={handleAction}
               disabled={processing}
               className={actionType === "reject" ? "bg-destructive hover:bg-destructive/90" : ""}
             >
               {processing ? "..." : t.confirm}
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
     </div>
   );
 };
 
 export default AdminRequests;