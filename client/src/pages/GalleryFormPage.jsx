import { useEffect, useState } from "react";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function GalleryFormPage(){
    const {id} = useParams();
    const [title,setTtitle] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [redirect,setRedirect] = useState(false);
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/gallery/'+id).then(response => {
            const {data} = response;
            setTtitle(data.title);
            setAddedPhotos(data.photos);
            setDescription(data.description);
        });
    }, [id]);
    
    async function addNewItem(ev){
        ev.preventDefault();
        const itemData = {
            title, addedPhotos, description
        };
        if (id) {
            //update
            await axios.put('/gallery', {
                id, ...itemData
            });
            setRedirect(true);
        } else {
            //new items
            await axios.post('/gallery', itemData);
            setRedirect(true);
        }

    }

    if (redirect) {
        return <Navigate to={'/account/gallery'} />
    }

    return(
        <div>
            <AccountNav />
            <form onSubmit={addNewItem}>
                <h2 className="text-2xl mt-4">Title</h2>
                <input type='text' value={title} onChange={ev => setTtitle(ev.target.value)} placeholder="title" />
                <h2 className="text-2xl mt-4">Photos</h2>
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                <h2 className="text-2xl mt-4">Description</h2>
                <textarea value={description} onChange={ev => setDescription(ev.target.value)} className="w-full border my-2 py-2 px-3 rounded-2xl" />
                <div>
                    <button className="primary my-4">Save</button>
                </div>
            </form> 
        </div>
    );
}