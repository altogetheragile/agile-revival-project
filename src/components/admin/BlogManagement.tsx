
import { useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { BlogManagementHeader } from "./blog/BlogManagementHeader";
import { BlogLoadingState } from "./blog/BlogLoadingState";
import { BlogErrorState } from "./blog/BlogErrorState";
import { BlogManagementContent } from "./blog/BlogManagementContent";
import { BlogFormDialog } from "./blog/BlogFormDialog";
import { BlogConfirmDeleteDialog } from "./blog/BlogConfirmDeleteDialog";
import { useBlogManagement } from "@/hooks/useBlogManagement";
import { useSeedBlogPosts } from "./blog/useSeedBlogPosts";

export const BlogManagement = () => {
  const {
    filteredPosts,
    searchTerm,
    setSearchTerm,
    isLoading,
    isError,
    errorMessage,
    isDialogOpen,
    setIsDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentBlogPost,
    isRefreshing,
    isSeedDataVisible,
    loadBlogPosts,
    handleRefresh,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleSave
  } = useBlogManagement();

  const { isAdmin } = useAuth();
  const { handleSeedData } = useSeedBlogPosts(handleRefresh);

  // Load blog posts on component mount
  useEffect(() => {
    loadBlogPosts();
  }, []);

  // Loading state
  if (isLoading && !isRefreshing) {
    return <BlogLoadingState />;
  }

  // Error state
  if (isError) {
    return (
      <BlogErrorState 
        errorMessage={errorMessage} 
        onRefresh={handleRefresh} 
        isRefreshing={isRefreshing} 
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with search and actions */}
      <BlogManagementHeader 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
        onAddNew={handleAddNew}
        onSeedData={handleSeedData}
        showSeedButton={isAdmin && isSeedDataVisible}
      />

      {/* Blog post grid */}
      <BlogManagementContent 
        filteredPosts={filteredPosts}
        isRefreshing={isRefreshing}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Form dialog for adding/editing blog posts */}
      <BlogFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentBlogPost={currentBlogPost}
        onSubmit={handleSave}
      />

      {/* Delete confirmation dialog */}
      <BlogConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
