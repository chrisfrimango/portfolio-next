async function getData() {
  // Artificial delay to show loading state
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return { data: "This is test data" };
}

export default async function TestPage() {
  const data = await getData();

  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-2xl">{data.data}</h1>
    </div>
  );
}
