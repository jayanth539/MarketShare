import CreateListingForm from "./CreateListingForm";

export default function NewListingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-headline font-bold">Create a New Listing</h1>
          <p className="text-muted-foreground mt-2">Fill out the details below to list your item for sale or rent.</p>
        </div>
        <CreateListingForm />
      </div>
    </div>
  );
}
