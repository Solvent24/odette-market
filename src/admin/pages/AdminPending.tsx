 import { Link } from "react-router-dom";
 import { useLanguage } from "@/hooks/useLanguage";
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Clock, ArrowLeft, Mail } from "lucide-react";
 
 const AdminPending = () => {
   const { language } = useLanguage();
 
   const t = {
     title: language === "rw" ? "Ubusabe bwawe bwoherejwe" : "Request Submitted",
     description: language === "rw"
       ? "Ubusabe bwawe bwo kuba admin bwoherejwe neza"
       : "Your admin access request has been submitted successfully",
     waiting: language === "rw"
       ? "Tegereza ko admin yemeza ubusabe bwawe. Uzabona imeyili igihe byemejwe."
       : "Please wait for an admin to approve your request. You'll receive an email once approved.",
     checkEmail: language === "rw"
       ? "Suzuma imeyili yawe"
       : "Check your email",
     emailNote: language === "rw"
       ? "Twakwohereje imeyili yo kwemeza. Nyamuneka kanda kuri link yo kwemeza imeyili yawe."
       : "We've sent you a verification email. Please click the link to verify your email address.",
     backToLogin: language === "rw" ? "Subira ku kwinjira" : "Back to Login",
     backToStore: language === "rw" ? "Subira mu iduka" : "Back to Store",
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-background p-4">
       <Card className="w-full max-w-md text-center">
         <CardHeader>
           <div className="mx-auto w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-4">
             <Clock className="h-10 w-10 text-accent" />
           </div>
           <CardTitle className="text-2xl font-display">{t.title}</CardTitle>
           <CardDescription className="text-base">{t.description}</CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
           <div className="bg-secondary/50 rounded-lg p-4 text-left">
             <div className="flex items-start gap-3">
               <Mail className="h-5 w-5 text-primary mt-0.5" />
               <div>
                 <p className="font-medium text-sm">{t.checkEmail}</p>
                 <p className="text-sm text-muted-foreground mt-1">{t.emailNote}</p>
               </div>
             </div>
           </div>
 
           <div className="bg-muted/50 rounded-lg p-4">
             <p className="text-sm text-muted-foreground">{t.waiting}</p>
           </div>
 
           <div className="flex flex-col gap-2">
             <Link to="/admin/login">
               <Button variant="outline" className="w-full gap-2">
                 <ArrowLeft className="h-4 w-4" />
                 {t.backToLogin}
               </Button>
             </Link>
             <Link to="/">
               <Button variant="ghost" className="w-full">
                 {t.backToStore}
               </Button>
             </Link>
           </div>
         </CardContent>
       </Card>
     </div>
   );
 };
 
 export default AdminPending;