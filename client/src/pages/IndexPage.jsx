import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function IndexPage(){
    const [gallery,setGallery] = useState([]);
    useEffect(() => {
        axios.get('/gallery').then(response => {
            setGallery([...response.data]);
        });
    }, []);
    return(
        <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-3 md:grid-cols-5 lg:grid-col-4">
           {gallery.length > 0 && gallery.map (item =>(
            <Link to={'/gallery/'+item._id}>
            <div>
                <div className="bg-gray-500 rounded-2xl flex">
                {item.photos?.[0] && (
                    <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4000/uploads/'+item.photos?.[0]} alt=""/>
                )}
                </div>
                 <h2 className="text-sm">{item.title}</h2>
                </div>
            </Link>
             ))}
        </div>
    );
}