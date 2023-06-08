import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ItemsPage() {
    const {id} = useParams();
    const [items,setItems] = useState(null);
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/gallery/'+id).then(response => {
            setItems(response.data);
        });
    }, [id]);

    if (!items) return '';

    return(
        <div className="mt-8 bg-gray-100 -mx-8 px-8 py-8">
            <h1 className="text-3xl">{items.title}</h1>
            <div className="grid gap-2 grid-cols-[2fr_1fr]">
                <div>
                {items.photos?.[0] && (
                    <div>
                        <img className="aspect-square object-cover" src={'http://localhost:4000/uploads/'+items.photos[0]} alt="" />
                    </div>
                    )}
                </div>
                <div className="grid">
                {items.photos?.[1] && (
                    <img className="aspect-square object-cover" src={'http://localhost:4000/uploads/'+items.photos[1]} alt="" />
                )}
                <div className="overflow-hidden">
                {items.photos?.[2] && (
                    <img className="aspect-square object-cover" src={'http://localhost:4000/uploads/'+items.photos[2]} alt="" />
                )}
                </div>
            </div>
        </div>
        <div>
            <h2 className="font-semibold text-2xl">Description</h2>
            {items.description}
        </div>
        </div>
    );
}