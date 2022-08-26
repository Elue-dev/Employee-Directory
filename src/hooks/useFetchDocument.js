import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { database } from "../firebase";

export default function useFetchDocuments(collectionName, documentID) {
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const getDocument = async () => {
      const docRef = doc(database, collectionName, documentID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists) {
        const obj = { id: documentID, ...docSnap.data() };
        setDocument(obj);
      } else {
        window.alert(`Document not found`);
      }
    };
    getDocument();
  }, [collectionName, documentID]);

  return { document };
}
