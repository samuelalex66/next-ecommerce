
import {useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";

export default function ProductForm({
    _id,
    title: existingTitle, 
    description: existingDescription, 
    price: existingPrice,
    images,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || ''); 
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const router = useRouter();
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            title,
            description,
            price
        
    };
        if (_id) {
            //update
            await axios.put('/api/products', {...data,_id});
        } else {
            //create
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }




    if (goToProducts) {
        router.push('/products')
    }
    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input 
                type="text" 
                placeholder="product name" 
                value={title} 
                onChange={ev => setTitle(ev.target.value)} 
            />
            <label>
                Photos
            </label>
            <div className="mb-2">
                <button className="w-24 h-24 border">

                </button>
                {!images?.length && (
                    <div>No photos in this product</div>
                )}
            </div>
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

    )
}
