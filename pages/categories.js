import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import axios from "axios";

export default function Categories() {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data) ;
        });
    }, [])
    async function saveCategory(ev) {
        ev.preventDefault()
        await axios.post('/api/categories', {name});
        
        setName('');
    }
    return (
        <Layout>
            
            <h1>Categories</h1>
            <label>New Category Name</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input value={name} onChange={ev => setName(ev.target.value)} className="mb-0" type="text" placeholder={'Category Name'}></input>
                <button type="submit" className="btn-primary py-1">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category Name</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => {
                        
                    })}
                </tbody>
            </table>
        </Layout>
    )
}