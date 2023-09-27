import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

function Categories({swal}) {
    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([])
    const [parentCategory, setParentCategory] = useState('');
    useEffect(() => {
        fetchCategories()
    }, []);
    function fetchCategories() {
        axios.get('/api/categories').then(result => {
          setCategories(result.data);
        });
      }
    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {name, parentCategory};
        if(editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories', data);
            setEditedCategory(null)
        } else {
            await axios.post('/api/categories', data);      
        }
        setName('');
        fetchCategories();
        
    }
    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id)
    }
     function deleteCategory(category) {
        swal.fire({
            title: `Do you want to delete ${category.name}?`,
            showDenyButton: true,
            denyButtonText: `Cancel`,
          }).then( async result  => {
           if (result.isConfirmed) {
            const {_id} = category;
            await axios.delete('/api/categories?_id=' + _id);
            fetchCategories()
           }
          })
    }
    function handlePropertyNameChange(index,property, newName) {
            setProperties(prev => {
                const properties = [...prev];
                properties[index].name = newName;
                return properties;
            });
        }
    function handlePropertyValuesChange(index,property, newValues) {
            setProperties(prev => {
                const properties = [...prev];
                properties[index].values = newValues;
                return properties;
            });
        }
    function addProperty() {
        setProperties(prev => {
            return [...prev, {name: '', values: ''}];
        })
    }
    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove
            });
        });
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ? `Edit Category ${editedCategory.name}` : 'Create New Category'}
            </label>
                <form onSubmit={saveCategory}>
                    <div className="flex gap-1">
                        <input value={name} onChange={ev => setName(ev.target.value)} className="mb-0" type="text" placeholder={'Category Name'}/>
                        <select className="mb-0" value={parentCategory} onChange={ev => setParentCategory(ev.target.value)}>
                            <option value="">No Parent Category</option>
                            {categories.length > 0 && categories.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="block">Properties</label>
                        <button type="button" onClick={addProperty} className="btn-default text-sm mb-2">Add New Property</button>
                            {properties.length > 0 && properties.map((property, index)=> (
                                <div  key={index} className="flex gap-1 mb-2">
                                    <input 
                                        type="text" 
                                        value={property.name}
                                        className="mb-0"
                                        onChange={ev => 
                                            handlePropertyNameChange(
                                                index, 
                                                property, 
                                                ev.target.value
                                            )} 
                                        placeholder="property name (example : color)"
                                    />
                                    <input 
                                        type="text"
                                        className="mb-0"
                                        onChange={ev => 
                                            handlePropertyValuesChange(
                                                index,
                                                property,
                                                ev.target.value
                                            )}
                                        value={property.values}
                                        placeholder="values, comma seperated"
                                    />
                                    <button 
                                        onClick={() => removeProperty(index)}
                                        className="btn-default"
                                        type="button"
                                        >
                                            Remove
                                    </button>
                                </div>
                            ))}
                    </div>
                    <div className="flex gap-1">
                        {editedCategory && (
                            <button type="button" className="btn-default" onClick={() => {
                                setEditedCategory(null);
                            }}>Cancel</button>
                        )}
                        <button type="submit" className="btn-primary py-1">Save</button>
                    </div>
                    
                </form>
            {!editedCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category Name</td>
                            <td>Parent Category</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <button onClick={() => editCategory(category)} className="btn-primary mr-1">Edit</button>
                                    <button 
                                    onClick={() => deleteCategory(category)}
                                    className="btn-primary"
                                    >DELETE</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Layout>
    )
}

export default withSwal(({swal}, ref)  => (
    <Categories swal={swal}/>
));