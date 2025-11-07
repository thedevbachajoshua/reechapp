'use client';

import { useUserContext } from '@/context/user-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2, Shield, User, HelpCircle, FileText, Info, Camera, Code } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { UserProfile } from '@/lib/data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UpdateProfilePicture } from '@/components/settings/update-profile-picture';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';


const profileFormSchema = {
  name: (value: string) => value.length > 0 ? null : "Name is required",
  photoURL: (value: string) => (value.startsWith('http://') || value.startsWith('https://') || value === '') ? null : "Must be a valid URL",
  phone: (value: string) => value.length > 0 ? null : "Phone is required",
  organization: (value: string) => null, // Optional
};


export default function SettingsPage() {
  const { userProfile, loading, setUserProfile } = useUserContext();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isPictureDialogOpen, setIsPictureDialogOpen] = useState(false);
  
  const handleSaveChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userProfile) return;

    setIsSaving(true);
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const photoURL = formData.get('photoURL') as string;
    const phone = formData.get('phone') as string;
    const organization = formData.get('organization') as string;

    const updatedProfile = {
      ...userProfile,
      name,
      photoURL,
      phone,
      organization,
    };
    
    setTimeout(() => {
        setUserProfile(updatedProfile as UserProfile);
        setIsSaving(false);
        toast({
            title: 'Profile Updated',
            description: 'Your profile has been successfully updated.',
        });
    }, 500);
  };

  const handleRoleChange = (newRole: UserProfile['role']) => {
    if (!userProfile || userProfile.role === newRole) return;
    
    setUserProfile({ ...userProfile, role: newRole });
    toast({
        title: "Role Updated",
        description: `Your role has been changed to ${newRole}. The sidebar will now update.`
    });
  };

  const handleProfilePictureUpdate = (newPhotoUrl: string) => {
    if (!userProfile) return;

    setUserProfile({...userProfile, photoURL: newPhotoUrl});

    toast({
        title: 'Profile Picture Updated',
        description: 'Your new profile picture has been set.',
    });
    setIsPictureDialogOpen(false);
  };


  if (loading || !userProfile) {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Settings</h1>
            <div className="w-full h-64 rounded-lg bg-muted animate-pulse" />
        </div>
    );
  }

  const otherRole: UserProfile['role'] = userProfile.role === 'Supervisor' ? 'Reacher' : 'Supervisor';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="more">More</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
            <Card>
                <form onSubmit={handleSaveChanges}>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>
                    Update your personal information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={userProfile.photoURL || undefined} alt={userProfile.name} data-ai-hint="person face" />
                          <AvatarFallback>{userProfile.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Dialog open={isPictureDialogOpen} onOpenChange={setIsPictureDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Camera className="mr-2 h-4 w-4" />
                                    Change Picture
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Update Profile Picture</DialogTitle>
                                    <DialogDescription>
                                        Take a new photo or upload one from your gallery.
                                    </DialogDescription>
                                </DialogHeader>
                                <UpdateProfilePicture 
                                  onPictureSelected={handleProfilePictureUpdate}
                                  currentPicture={userProfile.photoURL}
                                />
                            </DialogContent>
                        </Dialog>
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="photoURL">Profile Picture URL</Label>
                          <Input id="photoURL" name="photoURL" type="url" defaultValue={userProfile.photoURL || ''} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" defaultValue={userProfile.name || ''} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={userProfile.email || ''} disabled />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" defaultValue={(userProfile as any).phone || ''} />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="organization">Church/Organization (Optional)</Label>
                            <Input id="organization" name="organization" defaultValue={(userProfile as any).organization || ''} />
                        </div>
                    </div>
                    <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                    </Button>
                </CardContent>
                </form>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Your Role</CardTitle>
                    <CardDescription>Your current role determines your permissions within the app.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                        {userProfile.role === 'Supervisor' 
                            ? <Shield className="h-8 w-8 text-primary" /> 
                            : <User className="h-8 w-8 text-primary" />}
                        <div>
                             <p className="font-semibold">You are a</p>
                             <Badge className="text-base mt-1">{userProfile.role}</Badge>
                        </div>
                    </div>

                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">Switch to {otherRole}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to switch your role?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Changing your role to <span className="font-bold">{otherRole}</span> will alter your permissions and what you can see and do in the app. This action can be undone at any time from the settings page.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRoleChange(otherRole)}>
                                Yes, Switch to {otherRole}
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="more">
          <Card>
            <CardHeader>
              <CardTitle>Resources &amp; Support</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="help-center">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <HelpCircle /> Help Center
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-sm dark:prose-invert pl-8">
                    <h3 className="font-bold mt-2">Welcome to the REECH Help Center!</h3>
                    <p>Get quick answers and learn how to make the most of REECH.</p>
                    <h4 className="font-bold mt-4">📖 Getting Started</h4>
                    <ul>
                      <li>Sign up as a Supervisor or Reacher and set up your profile.</li>
                      <li>Supervisors can create outreaches and add reachers.</li>
                      <li>Reachers can join outreaches and record new converts.</li>
                    </ul>
                    <h4 className="font-bold mt-4">📅 Creating an Outreach</h4>
                    <ul>
                        <li>Supervisors tap “New Outreach” to create one.</li>
                        <li>Add outreach name, description, and date.</li>
                        <li>Assign reachers to the outreach and track progress in real-time.</li>
                    </ul>
                    <h4 className="font-bold mt-4">🙌 Adding New Converts</h4>
                     <ul>
                        <li>During outreach, reachers add names and phone numbers of new converts.</li>
                        <li>Supervisors can view and organize all contacts under each outreach.</li>
                    </ul>
                    <h4 className="font-bold mt-4">📲 Automated Messages</h4>
                     <ul>
                        <li>Enable automatic WhatsApp or SMS reminders to encourage follow-up.</li>
                        <li>Customize message templates from Settings → Communication.</li>
                    </ul>
                    <h4 className="font-bold mt-4">⚙️ Troubleshooting</h4>
                     <ul>
                        <li>If notifications or syncing fail, check your internet connection.</li>
                        <li>Ensure permissions for Contacts and Notifications are enabled.</li>
                        <li>Still stuck? Contact support@reachapp.org for help.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="terms-of-service">
                  <AccordionTrigger>
                     <div className="flex items-center gap-2">
                        <FileText /> Terms of Service
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-sm dark:prose-invert pl-8">
                    <p>By using REECH, you agree to uphold integrity and respect in all interactions.</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li><b>Purpose of REECH:</b> REECH is designed to support church and outreach teams in managing evangelism and follow-up.</li>
                      <li><b>Responsible Use:</b> Users must not use REECH for spam, harassment, or unrelated activities. Supervisors must ensure all outreach data is used ethically and lawfully.</li>
                      <li><b>Data and Content:</b> You are responsible for the accuracy of any information you upload. Do not share sensitive personal data without consent.</li>
                      <li><b>Modifications:</b> We may update REECH or these Terms at any time. Continued use means you accept any updates.</li>
                      <li><b>Account Termination:</b> We reserve the right to suspend or terminate accounts that misuse the app or violate these terms.</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="privacy-policy">
                  <AccordionTrigger>
                     <div className="flex items-center gap-2">
                        <FileText /> Privacy Policy
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-sm dark:prose-invert pl-8">
                    <p>Your privacy matters to us.</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li><b>Information We Collect:</b> We collect basic details like your name, phone number, and outreach activity to improve your experience.</li>
                      <li><b>How We Use It:</b> Your data helps organize outreaches, manage contacts, and automate follow-ups. Only authorized team members (supervisors and assigned reachers) can access relevant outreach data.</li>
                      <li><b>Data Security:</b> We use secure storage and encryption to protect your information. REECH never sells or shares your data with third parties.</li>
                      <li><b>Your Rights:</b> You can request your data to be deleted or exported anytime by contacting privacy@reachapp.org.</li>
                      <li><b>Children’s Privacy:</b> REECH is intended for users above 13 years old and for church or outreach use only.</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="about-reach">
                  <AccordionTrigger>
                     <div className="flex items-center gap-2">
                        <Info /> About REECH
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-sm dark:prose-invert pl-8">
                    <h4 className="font-bold mt-2">Our Mission</h4>
                    <p>To help believers connect, follow up, and nurture new converts with love and consistency.</p>
                    <h4 className="font-bold mt-4">What We Do</h4>
                    <p>REECH makes evangelism follow-up easy:</p>
                     <ul>
                        <li>Organize outreaches and track participation.</li>
                        <li>Collect and manage new convert contacts.</li>
                        <li>Automate reminders to help them grow in faith.</li>
                        <li>Build community through team collaboration and encouragement.</li>
                    </ul>
                    <h4 className="font-bold mt-4">Who We Serve</h4>
                    <p>Churches, campus ministries, and outreach teams who want to stay organized and intentional about soul-winning.</p>
                    <h4 className="font-bold mt-4">Our Vision</h4>
                    <p>To see every soul reached, nurtured, and established in the faith — one connection at a time.</p>
                  </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="about-development">
                  <AccordionTrigger>
                     <div className="flex items-center gap-2">
                        <Code /> About Development
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-sm dark:prose-invert pl-8">
                    <h4 className="font-bold mt-2">Developer</h4>
                    <p>REECH was designed and developed by Joshua Mba Bacha — a passionate young innovator and student who believes in using technology to advance God’s Kingdom across Africa and beyond.</p>
                    <h4 className="font-bold mt-4">Vision Behind REECH</h4>
                    <p>Joshua built REECH out of a deep desire to solve a real challenge in evangelism: the lack of consistent follow-up and discipleship after outreach. REECH combines faith and technology to help believers stay connected, nurture new converts, and strengthen their spiritual journey.</p>
                    <h4 className="font-bold mt-4">Development Philosophy</h4>
                     <p>Every feature in REECH is inspired by real evangelism experiences — simple, purposeful, and Spirit-led. The goal is to make soul-winning organized, collaborative, and effective through seamless tools and automation.</p>
                    <h4 className="font-bold mt-4">Contact</h4>
                     <p>
                        📧 mbabachajoshua@gmail.com<br/>
                        🌍 LinkedIn: Joshua Mba Bacha<br/>
                        💬 For collaboration or feedback, reach out anytime — let’s build tools that reach souls.
                     </p>
                    <h4 className="font-bold mt-4">Version Info</h4>
                    <p>Current Version: 1.0.0 (Beta)<br/>Developed and maintained by Joshua Mba Bacha</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
