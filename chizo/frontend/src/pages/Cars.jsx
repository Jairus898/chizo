import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import { carAPI } from '../services/api';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await carAPI.getAll();
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Plate Number', accessor: 'plateNumber' },
    { header: 'Driver Name', accessor: 'driverName' },
    { header: 'Phone Number', accessor: 'phoneNumber' },
    {
      header: 'Registration Date',
      accessor: 'createdAt',
      cell: (row) => new Date(row.createdAt).toLocaleDateString()
    },

  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Cars Management</h2>
      </div>

      <Card>
        {loading ? (
          <div className="text-center py-4">Loading cars...</div>
        ) : (
          <Table columns={columns} data={cars} />
        )}
      </Card>

    </div>
  );
};

export default Cars;
