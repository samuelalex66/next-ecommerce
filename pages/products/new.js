import { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

export default function NewProduct() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(''); 
    const [price, setPrice] = useState('');
    async function createProduct(ev) {
        ev.preventDefault();
        const data = {title, description, price}
        await axios.post('/api/products', data)
    }
    return <Layout>
        <form onSubmit={createProduct}>

            <h1>New Products</h1>
            <label>Products Name</label>
            <input 
                type="text" 
                placeholder="product name" 
                value={title} 
                onChange={ev => setTitle(ev.target.value)} 
            />
            <label>Description</label>
            <textarea 
                placeholder="description"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            ></textarea>
            <label>Price</label>
            <input 
                type="text" 
                placeholder="price" 
                value={price}
                onChange={ev => setPrice(ev.target.value)}
            />

            <button className="btn-primary" type="submit">Save</button>
        </form>
    </Layout>
} 