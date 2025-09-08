interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { id } = await params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Course: {id}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-black aspect-video rounded-lg mb-6 flex items-center justify-center">
            <p className="text-white">Video Player Placeholder</p>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
          <p className="text-gray-600">
            This is where the course content and description would be displayed.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Course Modules</h3>
          <div className="space-y-2">
            <div className="border rounded p-3">
              <p className="font-medium">Module 1: Introduction</p>
            </div>
            <div className="border rounded p-3">
              <p className="font-medium">Module 2: Fundamentals</p>
            </div>
            <div className="border rounded p-3">
              <p className="font-medium">Module 3: Practice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}