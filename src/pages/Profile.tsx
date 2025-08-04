import { useState } from "react";
import { User, Settings, Palette, Bell, Shield, MessageSquare, Database, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AccountSettings } from "./ProfileTabs/AccountSettings";
import { useTheme } from "next-themes";

type ProfileTab = "account" | "appearance" | "notifications" | "privacy" | "chat" | "data";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("account");
  const { theme, setTheme } = useTheme();

  const tabs = [
    { id: "account" as const, label: "Account", icon: User },
    { id: "appearance" as const, label: "Appearance", icon: Palette },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "privacy" as const, label: "Privacy & Security", icon: Shield },
    { id: "chat" as const, label: "Chat Settings", icon: MessageSquare },
    { id: "data" as const, label: "Data & Storage", icon: Database }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettings />;
      
      case "appearance":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Theme & Display
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme-toggle" className="flex items-center gap-2">
                    {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    Dark Mode
                  </Label>
                  <Switch
                    id="theme-toggle"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Chat Wallpaper</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-video bg-gradient-primary rounded-lg cursor-pointer border-2 border-primary"></div>
                    <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg cursor-pointer border-2 border-transparent hover:border-primary"></div>
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg cursor-pointer border-2 border-transparent hover:border-primary"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case "notifications":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="message-sounds">Message Sounds</Label>
                  <Switch id="message-sounds" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="vibration">Vibration</Label>
                  <Switch id="vibration" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="group-notifications">Group Chat Notifications</Label>
                  <Switch id="group-notifications" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case "privacy":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="online-status">Show Online Status</Label>
                  <Switch id="online-status" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="read-receipts">Read Receipts</Label>
                  <Switch id="read-receipts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="disappearing-default">7-Day Disappearing Messages (Default)</Label>
                  <Switch id="disappearing-default" defaultChecked />
                </div>
                <Separator />
                <Button variant="outline" className="w-full">Blocked Users</Button>
                <Button variant="outline" className="w-full">Two-Factor Authentication</Button>
              </CardContent>
            </Card>
          </div>
        );
      
      case "chat":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="typing-indicators">Show Typing Indicators</Label>
                  <Switch id="typing-indicators" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="message-reactions">Enable Message Reactions</Label>
                  <Switch id="message-reactions" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ai-assistant">Enable #konva AI Assistant</Label>
                  <Switch id="ai-assistant" defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Font Size</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Small</Button>
                    <Button variant="default" size="sm">Medium</Button>
                    <Button variant="outline" size="sm">Large</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case "data":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data & Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-download">Auto-download Media</Label>
                  <Switch id="auto-download" defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Media Storage Location</Label>
                  <div className="grid gap-2">
                    <Button variant="outline" className="justify-start">Save to Device</Button>
                    <Button variant="default" className="justify-start">Save to konva (30 days)</Button>
                    <Button variant="outline" className="justify-start">Save to Both</Button>
                  </div>
                </div>
                <Separator />
                <Button variant="outline" className="w-full">Clear Chat Cache</Button>
                <Button variant="outline" className="w-full">Download My Data</Button>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold gradient-text">Settings</h1>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent className="h-4 w-4 mr-3" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

