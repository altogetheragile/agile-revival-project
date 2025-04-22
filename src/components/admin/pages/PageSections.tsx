
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Trash, PlusCircle, Settings, MoveUp, MoveDown, PenLine } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

const SECTION_TYPES = [
  { value: "hero", label: "Hero Section" },
  { value: "content", label: "Content Section" },
  { value: "features", label: "Features Section" },
  { value: "testimonials", label: "Testimonials Section" },
  { value: "contact", label: "Contact Form" },
  { value: "gallery", label: "Image Gallery" },
  { value: "cta", label: "Call to Action" },
  { value: "services", label: "Services Section" },
  { value: "pricing", label: "Pricing Table" },
  { value: "faq", label: "FAQ Section" },
];

// Default template for a new section
const getDefaultSection = (type) => {
  const section = {
    id: `section-${Date.now()}`,
    type,
    title: "",
    content: "",
    enabled: true,
    settings: {}
  };
  
  switch (type) {
    case "hero":
      section.title = "Welcome to Our Site";
      section.content = "Your compelling headline that describes your core offering";
      section.settings = {
        buttonText: "Get Started",
        buttonLink: "/contact",
        imageUrl: ""
      };
      break;
    case "content":
      section.title = "About Us";
      section.content = "Write about your company, values, mission and history here.";
      break;
    case "features":
      section.title = "Our Features";
      section.content = "Highlight the key features of your products or services.";
      section.settings = {
        features: [
          { title: "Feature 1", description: "Description of feature 1" },
          { title: "Feature 2", description: "Description of feature 2" },
          { title: "Feature 3", description: "Description of feature 3" }
        ]
      };
      break;
    case "testimonials":
      section.title = "What Our Clients Say";
      section.content = "Real testimonials from our satisfied customers.";
      break;
    case "contact":
      section.title = "Get in Touch";
      section.content = "Reach out to us with any questions or inquiries.";
      break;
    default:
      section.title = "New Section";
      section.content = "Content goes here";
  }
  
  return section;
};

export const PageSections = ({ page, pages, setPages, onSave, onDeletePage }) => {
  const { toast } = useToast();
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [addingSectionType, setAddingSectionType] = useState("");
  const [currentSection, setCurrentSection] = useState(null);
  const [isDeletePageDialogOpen, setIsDeletePageDialogOpen] = useState(false);

  // Handle saving section changes
  const handleSaveSection = () => {
    if (!currentSection) return;
    
    const updatedSections = page.sections.map(s => 
      s.id === currentSection.id ? currentSection : s
    );
    
    const updatedPage = { ...page, sections: updatedSections };
    const updatedPages = pages.map(p => p.id === page.id ? updatedPage : p);
    
    setPages(updatedPages);
    onSave(updatedPages);
    setEditingSectionId(null);
    setCurrentSection(null);
  };

  // Handle adding a new section
  const handleAddSection = () => {
    if (!addingSectionType) {
      toast({
        title: "Error",
        description: "Please select a section type",
        variant: "destructive"
      });
      return;
    }
    
    const newSection = getDefaultSection(addingSectionType);
    const updatedPage = {
      ...page,
      sections: [...page.sections, newSection]
    };
    
    const updatedPages = pages.map(p => p.id === page.id ? updatedPage : p);
    setPages(updatedPages);
    onSave(updatedPages);
    setAddingSectionType("");
    
    // Start editing the new section
    setEditingSectionId(newSection.id);
    setCurrentSection(newSection);
  };

  // Handle deleting a section
  const handleDeleteSection = (sectionId) => {
    const updatedSections = page.sections.filter(s => s.id !== sectionId);
    const updatedPage = { ...page, sections: updatedSections };
    const updatedPages = pages.map(p => p.id === page.id ? updatedPage : p);
    
    setPages(updatedPages);
    onSave(updatedPages);
  };

  // Handle moving a section up or down
  const handleMoveSection = (sectionId, direction) => {
    const currentIndex = page.sections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === page.sections.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedSections = [...page.sections];
    const [movedSection] = updatedSections.splice(currentIndex, 1);
    updatedSections.splice(newIndex, 0, movedSection);
    
    const updatedPage = { ...page, sections: updatedSections };
    const updatedPages = pages.map(p => p.id === page.id ? updatedPage : p);
    
    setPages(updatedPages);
    onSave(updatedPages);
  };

  // Start editing a section
  const startEditSection = (section) => {
    setEditingSectionId(section.id);
    setCurrentSection({...section});
  };
  
  // Get section type display name
  const getSectionTypeName = (type) => {
    const sectionType = SECTION_TYPES.find(st => st.value === type);
    return sectionType ? sectionType.label : type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">{page.title}</h3>
          <p className="text-sm text-gray-500">URL: {page.url}</p>
        </div>
        <div className="flex space-x-2">
          <AlertDialog open={isDeletePageDialogOpen} onOpenChange={setIsDeletePageDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="h-4 w-4 mr-2" />
                Delete Page
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the "{page.title}" page and all its sections. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  setIsDeletePageDialogOpen(false);
                  onDeletePage();
                }}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Settings</CardTitle>
          <CardDescription>Update the basic information for this page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="page-title">Page Title</Label>
              <Input 
                id="page-title"
                value={page.title}
                onChange={(e) => {
                  const updatedPage = { ...page, title: e.target.value };
                  const updatedPages = pages.map(p => p.id === page.id ? updatedPage : p);
                  setPages(updatedPages);
                }}
                onBlur={() => onSave(pages)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page-url">Page URL</Label>
              <Input 
                id="page-url"
                value={page.url}
                onChange={(e) => {
                  const updatedPage = { ...page, url: e.target.value };
                  const updatedPages = pages.map(p => p.id === page.id ? updatedPage : p);
                  setPages(updatedPages);
                }}
                onBlur={() => onSave(pages)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Page Sections</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Section</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="section-type">Section Type</Label>
                <Select 
                  value={addingSectionType} 
                  onValueChange={setAddingSectionType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select section type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTION_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddingSectionType("")}>Cancel</Button>
                <Button onClick={handleAddSection}>Add Section</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {page.sections.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">No sections found for this page.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Section
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Section</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="section-type">Section Type</Label>
                    <Select 
                      value={addingSectionType} 
                      onValueChange={setAddingSectionType}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select section type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SECTION_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddingSectionType("")}>Cancel</Button>
                    <Button onClick={handleAddSection}>Add Section</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {page.sections.map((section, index) => (
              <Card key={section.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-2">
                        {getSectionTypeName(section.type)}
                      </span>
                      {section.title || "Untitled Section"}
                    </CardTitle>
                    <div className="flex space-x-1">
                      {index > 0 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleMoveSection(section.id, 'up')}
                          title="Move up"
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                      )}
                      {index < page.sections.length - 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleMoveSection(section.id, 'down')}
                          title="Move down"
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 line-clamp-2">{section.content}</p>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => startEditSection(section)}
                  >
                    <PenLine className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteSection(section.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Section Dialog */}
      <Dialog 
        open={editingSectionId !== null} 
        onOpenChange={(isOpen) => !isOpen && setEditingSectionId(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit {currentSection && getSectionTypeName(currentSection.type)}</DialogTitle>
          </DialogHeader>
          {currentSection && (
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="section-title">Section Title</Label>
                <Input 
                  id="section-title"
                  value={currentSection.title}
                  onChange={(e) => setCurrentSection({
                    ...currentSection,
                    title: e.target.value
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-content">Content</Label>
                <Textarea 
                  id="section-content"
                  value={currentSection.content}
                  onChange={(e) => setCurrentSection({
                    ...currentSection,
                    content: e.target.value
                  })}
                  rows={5}
                />
              </div>

              {/* Section-specific settings */}
              {currentSection.type === "hero" && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Hero Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="button-text">Button Text</Label>
                      <Input 
                        id="button-text"
                        value={currentSection.settings?.buttonText || ""}
                        onChange={(e) => setCurrentSection({
                          ...currentSection,
                          settings: {
                            ...currentSection.settings,
                            buttonText: e.target.value
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="button-link">Button Link</Label>
                      <Input 
                        id="button-link"
                        value={currentSection.settings?.buttonLink || ""}
                        onChange={(e) => setCurrentSection({
                          ...currentSection,
                          settings: {
                            ...currentSection.settings,
                            buttonLink: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image-url">Background Image URL</Label>
                    <Input 
                      id="image-url"
                      value={currentSection.settings?.imageUrl || ""}
                      onChange={(e) => setCurrentSection({
                        ...currentSection,
                        settings: {
                          ...currentSection.settings,
                          imageUrl: e.target.value
                        }
                      })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              )}
              
              {/* Features section */}
              {currentSection.type === "features" && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">Features</h4>
                  {(currentSection.settings?.features || []).map((feature, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h5 className="font-medium">Feature {idx + 1}</h5>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              const updatedFeatures = [...(currentSection.settings?.features || [])];
                              updatedFeatures.splice(idx, 1);
                              setCurrentSection({
                                ...currentSection,
                                settings: {
                                  ...currentSection.settings,
                                  features: updatedFeatures
                                }
                              });
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`feature-title-${idx}`}>Title</Label>
                          <Input 
                            id={`feature-title-${idx}`}
                            value={feature.title}
                            onChange={(e) => {
                              const updatedFeatures = [...(currentSection.settings?.features || [])];
                              updatedFeatures[idx].title = e.target.value;
                              setCurrentSection({
                                ...currentSection,
                                settings: {
                                  ...currentSection.settings,
                                  features: updatedFeatures
                                }
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`feature-desc-${idx}`}>Description</Label>
                          <Textarea 
                            id={`feature-desc-${idx}`}
                            value={feature.description}
                            onChange={(e) => {
                              const updatedFeatures = [...(currentSection.settings?.features || [])];
                              updatedFeatures[idx].description = e.target.value;
                              setCurrentSection({
                                ...currentSection,
                                settings: {
                                  ...currentSection.settings,
                                  features: updatedFeatures
                                }
                              });
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const updatedFeatures = [...(currentSection.settings?.features || [])];
                      updatedFeatures.push({
                        title: `Feature ${updatedFeatures.length + 1}`,
                        description: "Description of this feature"
                      });
                      setCurrentSection({
                        ...currentSection,
                        settings: {
                          ...currentSection.settings,
                          features: updatedFeatures
                        }
                      });
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="section-enabled"
                    checked={currentSection.enabled}
                    onChange={(e) => setCurrentSection({
                      ...currentSection,
                      enabled: e.target.checked
                    })}
                  />
                  <Label htmlFor="section-enabled">Section Enabled</Label>
                </div>
                <p className="text-xs text-gray-500">
                  Disabled sections won't be displayed on your site.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSectionId(null)}>Cancel</Button>
            <Button onClick={handleSaveSection}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
