import { useParams } from 'react-router-dom';

// Make sure 'export' is right before 'const'
export const BeverageDetails = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Beverage Details</h1>
      <p>Viewing item ID: {id}</p>
    </div>
  );
};