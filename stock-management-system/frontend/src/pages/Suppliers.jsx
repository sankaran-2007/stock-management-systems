import Crud from '../components/Crud.jsx';

export default function Suppliers() {
  return (
    <Crud
      title="Suppliers" singular="Supplier" endpoint="/suppliers"
      columns={[
        { key: 'id', label: 'ID' }, { key: 'name', label: 'Supplier Name' }, { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' }, { key: 'address', label: 'Address' },
      ]}
      fields={[
        { name: 'name', label: 'Supplier Name', required: true },
        { name: 'phone', label: 'Phone', type: 'tel', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'address', label: 'Address', required: true },
      ]}
    />
  );
}
