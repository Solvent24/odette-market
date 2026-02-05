 import { useState } from "react";
 import { useNavigate, Link } from "react-router-dom";
 import { supabase } from "@/integrations/supabase/client";
 import { useLanguage } from "@/hooks/useLanguage";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { useToast } from "@/hooks/use-toast";
 import { Lock, Mail, User, FileText, ArrowLeft } from "lucide-react";
 
 const AdminRegister = () => {
   const { language } = useLanguage();
   const navigate = useNavigate();
   const { toast } = useToast();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [fullName, setFullName] = useState("");
   const [reason, setReason] = useState("");
   const [loading, setLoading] = useState(false);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     
     if (password !== confirmPassword) {
       toast({
         title: language === "rw" ? "Ikosa" : "Error",
         description: language === "rw" 
           ? "Amagambo y'ibanga ntabwo ahura" 
           : "Passwords do not match",
         variant: "destructive",
       });
       return;
     }
 
     if (password.length < 6) {
       toast({
         title: language === "rw" ? "Ikosa" : "Error",
         description: language === "rw" 
           ? "Ijambo ry'ibanga rigomba kuba nibura inyuguti 6" 
           : "Password must be at least 6 characters",
         variant: "destructive",
       });
       return;
     }
 
     setLoading(true);
 
     try {
       // 1. Sign up the user
       const { data: authData, error: signUpError } = await supabase.auth.signUp({
         email,
         password,
         options: {
           emailRedirectTo: `${window.location.origin}/admin/login`,
           data: {
             full_name: fullName,
           },
         },
       });
 
       if (signUpError) throw signUpError;
 
       if (authData.user) {
         // 2. Create admin request
         const { error: requestError } = await supabase
           .from("admin_requests")
           .insert({
             user_id: authData.user.id,
             email,
             full_name: fullName,
             reason,
             status: "pending",
           });
 
         if (requestError) throw requestError;
 
         toast({
           title: language === "rw" ? "Byagenze neza!" : "Success!",
           description: language === "rw"
             ? "Ubusabe bwawe bwoherejwe. Tegereza kwemezwa na Admin."
             : "Your request has been submitted. Please wait for admin approval.",
         });
 
         // Sign out immediately - they need approval first
         await supabase.auth.signOut();
         
         navigate("/admin/pending");
       }
     } catch (error: any) {
       console.error("Registration error:", error);
       toast({
         title: language === "rw" ? "Ikosa" : "Error",
         description: error.message,
         variant: "destructive",
       });
     } finally {
       setLoading(false);
     }
   };
 
   const t = {
     title: language === "rw" ? "Kwiyandikisha nk'Admin" : "Admin Registration",
     description: language === "rw"
       ? "Uzaba ukeneye kwemezwa na admin mbere yo kwinjira"
       : "You'll need admin approval before you can access the dashboard",
     email: language === "rw" ? "Imeyili" : "Email",
     password: language === "rw" ? "Ijambo ry'ibanga" : "Password",
     confirmPassword: language === "rw" ? "Emeza ijambo ry'ibanga" : "Confirm Password",
     fullName: language === "rw" ? "Amazina yuzuye" : "Full Name",
     reason: language === "rw" ? "Impamvu ukeneye uburenganzira bw'admin" : "Why do you need admin access?",
     reasonPlaceholder: language === "rw" 
       ? "Sobanura impamvu ukeneye kuba admin..." 
       : "Explain why you need admin access...",
     submit: language === "rw" ? "Ohereza ubusabe" : "Submit Request",
     submitting: language === "rw" ? "Kohereza..." : "Submitting...",
     backToLogin: language === "rw" ? "Subira ku kwinjira" : "Back to Login",
     haveAccount: language === "rw" ? "Usanzwe ufite konti?" : "Already have an account?",
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-background p-4">
       <Card className="w-full max-w-md">
         <CardHeader className="text-center">
           <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
             <span className="text-primary-foreground font-bold text-2xl">O</span>
           </div>
           <CardTitle className="text-2xl font-display">{t.title}</CardTitle>
           <CardDescription>{t.description}</CardDescription>
         </CardHeader>
         <CardContent>
           <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="fullName">{t.fullName}</Label>
               <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   id="fullName"
                   type="text"
                   placeholder="John Doe"
                   value={fullName}
                   onChange={(e) => setFullName(e.target.value)}
                   className="pl-10"
                   required
                 />
               </div>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="email">{t.email}</Label>
               <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   id="email"
                   type="email"
                   placeholder="admin@example.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="pl-10"
                   required
                 />
               </div>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="password">{t.password}</Label>
               <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   id="password"
                   type="password"
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="pl-10"
                   required
                 />
               </div>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
               <div className="relative">
                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   id="confirmPassword"
                   type="password"
                   placeholder="••••••••"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   className="pl-10"
                   required
                 />
               </div>
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="reason">{t.reason}</Label>
               <div className="relative">
                 <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                 <Textarea
                   id="reason"
                   placeholder={t.reasonPlaceholder}
                   value={reason}
                   onChange={(e) => setReason(e.target.value)}
                   className="pl-10 min-h-[100px]"
                   required
                 />
               </div>
             </div>
 
             <Button type="submit" className="w-full" disabled={loading}>
               {loading ? t.submitting : t.submit}
             </Button>
           </form>
 
           <div className="mt-6 text-center">
             <p className="text-sm text-muted-foreground">{t.haveAccount}</p>
             <Link 
               to="/admin/login" 
               className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
             >
               <ArrowLeft className="h-3 w-3" />
               {t.backToLogin}
             </Link>
           </div>
         </CardContent>
       </Card>
     </div>
   );
 };
 
 export default AdminRegister;