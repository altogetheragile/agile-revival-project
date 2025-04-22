
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageSections } from "./pages/PageSections";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSiteSettings } from "@/contexts/site-settings";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_PAGE = {
  id: "home",
  title: "Home",
  url: "/",
  sections: []
};

const PageManagement = () => {
  const { settings, updateSettings, isLoading } = useSiteSettings();
  const { toast } = useToast();
  const [pages, setPages] = useState(settings.pages || []);
  const [activePageId, setActivePageId] = useState(pages[0]?.id || "home");
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [newPage, setNewPage] = useState({ title: "", url: "" });
  const [saving, setSaving] = useState(false);
  
  // Save all page changes
  const savePages = async (updatedPages) => {
    setSaving(true);
    try {
      await updateSettings("pages", updatedPages);
      setPages(updatedPages);
      toast({
        title: "Success",
        description: "Pages updated successfully",
      });
    } catch (error) {
      console.error("Error saving pages:", error);
      toast({
        title: "Error",
        description: "Failed to save page changes",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Add a new page
  const handleAddPage = async () => {
    if (!newPage.title || !newPage.url) {
      toast({
        title: "Error",
        description: "Page title and URL are required",
        variant: "destructive"
      });
      return;
    }
    
    // Generate a unique ID for the new page
    const id = newPage.title.toLowerCase().replace(/\s+/g, "-");
    
    // Check if page with this ID already exists
    if (pages.some(p => p.id === id)) {
      toast({
        title: "Error",
        description: "A page with this title already exists",
        variant: "destructive"
      });
      return;
    }
    
    const updatedPages = [
      ...pages,
      {
        id,
        title: newPage.title,
        url: newPage.url,
        sections: []
      }
    ];
    
    await savePages(updatedPages);
    setActivePageId(id);
    setNewPage({ title: "", url: "" });
    setIsAddPageOpen(false);
  };
  
  // Delete a page
  const handleDeletePage = async (pageId) => {
    if (pages.length <= 1) {
      toast({
        title: "Error",
        description: "You must have at least one page",
        variant: "destructive"
      });
      return;
    }
    
    const updatedPages = pages.filter(p => p.id !== pageId);
    await savePages(updatedPages);
    
    // If the active page was deleted, switch to the first page
    if (pageId === activePageId) {
      setActivePageId(updatedPages[0].id);
    }
  };

  // Initialize with default page if no pages exist
  React.useEffect(() => {
    if (settings.pages && settings.pages.length > 0) {
      setPages(settings.pages);
      setActivePageId(settings.pages[0].id);
    } else if (!isLoading && (!pages || pages.length === 0)) {
      setPages([DEFAULT_PAGE]);
      setActivePageId(DEFAULT_PAGE.id);
      // Save default page if no pages exist
      updateSettings("pages", [DEFAULT_PAGE]);
    }
  }, [settings.pages, isLoading]);

  // Get the active page
  const activePage = pages.find(p => p.id === activePageId) || DEFAULT_PAGE;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Page Management</h2>
        <Dialog open={isAddPageOpen} onOpenChange={setIsAddPageOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Page</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input 
                  id="title" 
                  value={newPage.title}
                  onChange={(e) => setNewPage(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Home, About Us, Contact, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Page URL</Label>
                <Input 
                  id="url" 
                  value={newPage.url}
                  onChange={(e) => setNewPage(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="/about, /contact, etc."
                />
                <p className="text-xs text-gray-500">
                  Use "/" for the homepage, "/about" for an about page, etc.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddPageOpen(false)}>Cancel</Button>
              <Button onClick={handleAddPage} disabled={saving}>Add Page</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activePageId} onValueChange={setActivePageId} className="w-full">
        <TabsList className="mb-6 grid grid-cols-2 md:flex gap-2 overflow-x-auto">
          {pages.map(page => (
            <TabsTrigger key={page.id} value={page.id}>
              {page.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {pages.map(page => (
          <TabsContent key={page.id} value={page.id} className="space-y-6">
            <PageSections 
              page={page} 
              pages={pages}
              setPages={setPages}
              onSave={savePages} 
              onDeletePage={() => handleDeletePage(page.id)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PageManagement;
