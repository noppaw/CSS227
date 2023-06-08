import { Link, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";

export default function GalleryPage() {
  const [gallery,setGallery] = useState([]);
 useEffect(() => {
  axios.get('/gallery').then(({data}) =>{
    setGallery(data);
  });
 }, []);
  return (
    <div>
        <AccountNav />
        <div className="text-center">
            List of all item
            <br />
            <Link className="inline-flex gap-1 bg-primary text-white rounded-full py-2 px-4"
             to = {'new'}>
                Add new item
            </Link>
        </div>
        <div className="mt-4">
          {gallery.length > 0 && gallery.map(item => (
            <Link to={'/account/gallery/'+item._id } className="flex cursor-pointer gap-4 bg-gray-100 p-2 rounded-2xl">
             <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
              {item.photos.length > 0 && (
                <img className="object-cover" src={'http://localhost:4000/uploads/'+item.photos[0]} alt=""/>
              )}
            </div>
            <div className="grow-0 shrink"> 
              <h2 className="text-xl">{item.title}</h2>
              <p className="text-sm mt-2">{item.description}</p>
            </div>
            </Link>
          ))}
        </div>
    </div>
  );
}
