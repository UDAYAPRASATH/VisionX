import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Shield, Database, Palette, Key, Globe, Mail, Trash2, Save } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: "Alex Chen",
    email: "alex.chen@company.com",
    role: "developer",
    bio: "Full-stack developer focused on quality assurance and visual testing.",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    testFailures: true,
    testCompletions: false,
    weeklyReports: true,
    securityAlerts: true,
  });

  // API settings
  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Playwright API", key: "pk_test_***", status: "active", lastUsed: "2 hours ago" },
    { id: "2", name: "Slack Integration", key: "xoxb-***", status: "active", lastUsed: "1 day ago" },
    { id: "3", name: "GitHub Webhooks", key: "ghp_***", status: "inactive", lastUsed: "Never" },
  ]);

  // Team settings
  const [teamMembers] = useState([
    { id: "1", name: "Alex Chen", email: "alex.chen@company.com", role: "Admin", status: "active" },
    { id: "2", name: "Sarah Kim", email: "sarah.kim@company.com", role: "Developer", status: "active" },
    { id: "3", name: "Mike Johnson", email: "mike.johnson@company.com", role: "QA", status: "active" },
  ]);

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notifications Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleGenerateApiKey = () => {
    toast({
      title: "API Key Generated",
      description: "A new API key has been generated and copied to your clipboard.",
    });
  };

  const handleRevokeApiKey = (keyId: string) => {
    setApiKeys(keys => keys.filter(key => key.id !== keyId));
    toast({
      title: "API Key Revoked",
      description: "The API key has been revoked and is no longer active.",
      variant: "destructive",
    });
  };

  return (
    <MainLayout
      title="Settings"
      description="Configure your VisionX workspace"
    >
      <div className="space-y-6">
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="visionx-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <Button variant="outline">Change Avatar</Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select value={profileData.role} onValueChange={(value) => setProfileData(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="qa">QA Engineer</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={6}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile} className="visionx-button-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="visionx-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Test Notifications</Label>
                      
                      <div className="space-y-3 ml-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Test Failures</Label>
                            <p className="text-sm text-muted-foreground">Get notified when tests fail</p>
                          </div>
                          <Switch
                            checked={notifications.testFailures}
                            onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, testFailures: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Test Completions</Label>
                            <p className="text-sm text-muted-foreground">Get notified when test runs complete</p>
                          </div>
                          <Switch
                            checked={notifications.testCompletions}
                            onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, testCompletions: checked }))}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Reports & Security</Label>
                      
                      <div className="space-y-3 ml-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Weekly Reports</Label>
                            <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
                          </div>
                          <Switch
                            checked={notifications.weeklyReports}
                            onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReports: checked }))}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Security Alerts</Label>
                            <p className="text-sm text-muted-foreground">Important security notifications</p>
                          </div>
                          <Switch
                            checked={notifications.securityAlerts}
                            onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, securityAlerts: checked }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveNotifications} className="visionx-button-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="visionx-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>Appearance Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Theme</Label>
                      <p className="text-sm text-muted-foreground mb-3">Choose your preferred theme</p>
                      <div className="grid grid-cols-3 gap-3">
                        <Card 
                          className={`cursor-pointer transition-all ${theme === 'light' ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => theme !== 'light' && toggleTheme()}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="w-full h-12 bg-white border border-gray-200 rounded mb-2"></div>
                            <p className="text-sm font-medium">Light</p>
                          </CardContent>
                        </Card>
                        
                        <Card 
                          className={`cursor-pointer transition-all ${theme === 'dark' ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => theme !== 'dark' && toggleTheme()}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="w-full h-12 bg-gray-900 border border-gray-700 rounded mb-2"></div>
                            <p className="text-sm font-medium">Dark</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="cursor-pointer opacity-50">
                          <CardContent className="p-4 text-center">
                            <div className="w-full h-12 bg-gradient-to-r from-white via-gray-100 to-gray-900 rounded mb-2"></div>
                            <p className="text-sm font-medium">Auto</p>
                            <Badge variant="secondary" className="text-xs mt-1">Soon</Badge>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Interface Density</Label>
                      <p className="text-sm text-muted-foreground mb-3">Adjust the spacing and size of interface elements</p>
                      <Select defaultValue="comfortable">
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="comfortable">Comfortable</SelectItem>
                          <SelectItem value="spacious">Spacious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Animations</Label>
                      <p className="text-sm text-muted-foreground mb-3">Control interface animations and transitions</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Enable animations</Label>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Reduce motion</Label>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="visionx-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Password</Label>
                    <p className="text-sm text-muted-foreground mb-3">Change your account password</p>
                    <div className="space-y-3 max-w-md">
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                      <Input type="password" placeholder="Confirm new password" />
                      <Button variant="outline">Update Password</Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground mb-3">Add an extra layer of security to your account</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="text-warning">Not Enabled</Badge>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium">Active Sessions</Label>
                    <p className="text-sm text-muted-foreground mb-3">Manage your active login sessions</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">Chrome on macOS • San Francisco, CA</p>
                        </div>
                        <Badge className="bg-success/10 text-success">Active</Badge>
                      </div>
                      <Button variant="outline" className="text-destructive">
                        Sign Out All Other Sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="visionx-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="w-5 h-5" />
                    <span>API Keys</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Manage API keys for integrations and automation
                      </p>
                    </div>
                    <Button onClick={handleGenerateApiKey} className="visionx-button-primary">
                      <Key className="w-4 h-4 mr-2" />
                      Generate New Key
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <p className="font-medium">{apiKey.name}</p>
                            <Badge className={apiKey.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}>
                              {apiKey.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-muted-foreground font-mono">{apiKey.key}</p>
                            <p className="text-sm text-muted-foreground">Last used: {apiKey.lastUsed}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Copy
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => handleRevokeApiKey(apiKey.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="visionx-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Team Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Manage team members and their permissions
                      </p>
                    </div>
                    <Button className="visionx-button-primary">
                      <Mail className="w-4 h-4 mr-2" />
                      Invite Member
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={member.role === 'Admin' ? 'default' : 'secondary'}>
                            {member.role}
                          </Badge>
                          <Badge className="bg-success/10 text-success">
                            {member.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
