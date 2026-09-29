import Crud from '../components/Crud.jsx';

export default function Categories() {
  return (
    <Crud
      title="Categories" singular="Category" endpoint="/categories"
      columns={[
        { key: 'id', label: 'ID' }, { key: 'name', label: 'Category Name' }, { key: 'description', label: 'Description' },
      ]}
      fields={[
        { name: 'name', label: 'Category Name', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]}
    />
  );
}
