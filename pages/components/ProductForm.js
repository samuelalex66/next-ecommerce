
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Spinners from "./Spinners";
import { ReactSortable } from "react-sortablejs";


export default function ProductForm({
    _id,
    title: existingTitle, 
    description: existingDescription, 
    price: existingPrice,
    images : existingImages,
    category : assignedCategory,
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || ''); 
    const [category, setCategory] = useState(assignedCategory || '')
    const [price, setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || [])
    const [goToProducts, setGoToProducts] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] =useState('')
    const router = useRouter();
    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }, [])
    async function saveProduct(ev) {
        ev.preventDefault();
        const data = {
            title,
            description,
            price,
            images,
            category
        
        };
        if (_id) {
            //update
            await axios.put('/api/products', {...data,_id});
        } else {
            //create
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    };

    if (goToProducts) {
        router.push('/products');
    };

    async function uploadImages(ev) {
        const files = ev.target?.files;
        if (files?.length > 0) {
            setIsUploading(true)
            const data = new FormData();
            for(const file of files) {
                data.append('file', file)
            }
            const res = await axios.post('/api/upload', data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            });
            setIsUploading(false)
        }
    }

    function updateImagesOrder(images) {
        setImages(images);
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
                Category
            </label>
            <select 
                value={category}
                onChange={ev => setCategory(ev.target.value)}
            >
                <option value="">Unctergorized</option>
                {categories.length > 0 && categories.map(c => (
                    <option value={c._id}>{c.name}</option>
                ))}
            </select>
            <label>
                Photos
            </label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable
                    list={images}
                    className="flex flex-wrap gap-1"
                    setList={updateImagesOrder}>
                        {!!images?.length && images.map(link => (
                        <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                            <img src={link} alt="" className="rounded-lg"/>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="w-24 flex items-center">
                        <Spinners />
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Upload
                    </div>  
                    <input type="file" className="hidden" onChange={uploadImages} />  
                </label>
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
