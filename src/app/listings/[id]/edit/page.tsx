import EditListingForm from "./EditListingForm";

export default function EditListingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-headline font-bold">Edit Your Listing</h1>
          <p className="text-muted-foreground mt-2">Update the details of your item for sale or rent.</p>
        </div>
        <EditListingForm />
      </div>
    </div>
  );
}
