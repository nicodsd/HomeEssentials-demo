import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";

import NavigationComponent from "./NavigationComponent";
import categories_actions from "../../store/actions/categories";
import manufacturers_actions from "../../store/actions/manufacturers";
import apiUrl from "../../../api";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories_read } = categories_actions;
  const { manufacturers_read } = manufacturers_actions;

  const categories = useSelector((store) => store.categories);
  const manufacturers = useSelector((store) => store.manufacturerHome.manufacturers);
  const categories2 = categories.categories || [];

  const [productData, setProductData] = useState({ products: [], totalPages: 1 });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);

  const initialFormState = {
    name: "",
    description: "",
    price: "",
    price_offer: "",
    percentage_offer: "",
    photo: "",
    stock_Available: "",
    category_id: "",
    manufacturer_id: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formDataEdit, setFormDataEdit] = useState(initialFormState);

  // Fetch inicial de Redux
  useEffect(() => {
    if (categories.length === 0) dispatch(categories_read());
    if (!manufacturers || manufacturers.length === 0) dispatch(manufacturers_read());
  }, [dispatch, categories.length, manufacturers, categories_read, manufacturers_read]);

  // Fetch de productos
  useEffect(() => {
    fetch(`${apiUrl}products`)
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching products");
        return res.json();
      })
      .then((data) => setProductData(data))
      .catch((err) => console.error(err));
  }, [page]);

  // Sincronizar estado de edición cuando se selecciona un producto
  useEffect(() => {
    if (selectedProduct) {
      setFormDataEdit({
        name: selectedProduct.name,
        description: selectedProduct.description,
        price: selectedProduct.price,
        price_offer: selectedProduct.price_offer,
        percentage_offer: selectedProduct.percentage_offer,
        photo: selectedProduct.photo,
        stock_Available: selectedProduct.stock_Available,
        category_id: selectedProduct.category_id,
        manufacturer_id: selectedProduct.manufacturer_id,
      });
    }
  }, [selectedProduct]);

  // Paginación
  const handleArrowNext = () => {
    if (productData.products?.length > 0 && page < productData.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handleArrowPrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  // Manejadores Genéricos de Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputEditChange = (e) => {
    const { name, value } = e.target;
    setFormDataEdit((prev) => ({ ...prev, [name]: value }));
  };

  // Modales
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleEditModal = (product = null) => {
    setSelectedProduct(product);
    setIsModal2Open(!isModal2Open);
  };

  // CRUD Actions
  const handleCreate = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to create this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, create it!",
      confirmButtonColor: "#7847E0",
      cancelButtonColor: "#d33",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${apiUrl}admin/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Error creating product");
            return res.json();
          })
          .then(() => {
            Swal.fire("Created!", "The product has been created successfully.", "success");
            toggleModal();
            setFormData(initialFormState); // Limpiar form
            // Idealmente acá harías un re-fetch de la página actual
          })
          .catch((error) => console.error(error));
      }
    });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to edit this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#7847E0",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${apiUrl}admin/update/${selectedProduct._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataEdit),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Error updating product");
            return res.json();
          })
          .then(() => {
            setProductData((prev) => ({
              ...prev,
              products: prev.products.map((p) =>
                p._id === selectedProduct._id ? { ...p, ...formDataEdit } : p
              ),
            }));
            toggleEditModal();
            Swal.fire("Success!", "Your product has been edited.", "success");
          })
          .catch((error) => console.error(error));
      }
    });
  };

  const handleDelete = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7847E0",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${apiUrl}admin/deleteone/${productId}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) throw new Error("Error deleting product");
            return res.json();
          })
          .then(() => {
            setProductData((prev) => ({
              ...prev,
              products: prev.products.filter((p) => p._id !== productId),
            }));
            Swal.fire("Deleted!", "Product has been deleted.", "success");
          })
          .catch((error) => console.error(error));
      }
    });
  };

  console.log(productData)

  const imageStyle = "h-[100%] w-[100%] object-cover cursor-pointer";

  return (
    <div className="h-screen flex bg-gray-100">
      <NavigationComponent />

      <div className="flex-1 p-8 overflow-scroll">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Products</h2>
        <div className="flex flex-row gap-3 items-center mb-4 justify-end content-center">
          <div className="bg-black cursor-pointer text-white px-7 py-2 flex items-center gap-2 rounded-md">
            <h2 className="text-xl md:text-2x -mt-2">Add a new product</h2>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-6 h-6" onClick={toggleModal} strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0" /></svg>
          </div>
        </div>

        {/* Product Grid */}
        <div className="h-fit lg:w-full gap-3 justify-start flex-wrap flex">
          {productData.products?.map((car) => (
            <div
              key={car._id}
              className="flex flex-col hover:shadow-[0_4px_10px_rgba(0,0,0,0.10)] transition-transform transform hover:scale-105 hover:rounded-sm shadow-[0_0_4px_rgba(0,0,0,0.15)] cursor-pointer w-[100%] sm:w-[40%] xl:w-[11vw] 2xl:w-[10%]"
            >
              <div className="h-[30vw] sm:h-[20vw] md:h-[10vw] relative">
                {/* Icono Editar */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-6 h-6 absolute top-2 left-2 z-10 cursor-pointer transition-transform transform hover:scale-150 text-white drop-shadow-md" onClick={() => toggleEditModal(car)} strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>

                {/* Icono Eliminar */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-6 h-6 absolute top-2 right-2 z-10 cursor-pointer transition-transform transform hover:scale-150 text-white drop-shadow-md" onClick={() => handleDelete(car._id)} strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.089 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0" /></svg>

                <img
                  onClick={() => navigate(`/products/${car._id}`)}
                  className={imageStyle}
                  src={car.photo}
                  alt={car.name}
                />
              </div>
              <div className="h-fit relative border-t-[1px] border-[#393939] flex flex-col p-2 justify-start">
                <h2 className="text-md font-semibold text-black">
                  {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(car.price)}
                </h2>
                <h2 className="text-xs 2xl:text-md text-[#393939] text-start">
                  {car.name}
                </h2>
                <h2 className="text-xs 2xl:text-md text-[#393939] text-start">
                  Stock: {car.stock_Available}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center gap-2 mt-8">
          <button
            className="bg-gray-500 border rounded-lg py-2 px-4 border-black text-white font-bold disabled:opacity-50"
            onClick={handleArrowPrev}
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            className="bg-gray-500 border rounded-lg py-2 px-4 border-black text-white font-bold disabled:opacity-50"
            onClick={handleArrowNext}
            disabled={page >= (productData.totalPages || 1)}
          >
            Next
          </button>
        </div>

        {/* Modal Crear */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="justify-end flex">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-6 h-6 cursor-pointer" onClick={toggleModal} strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" /></svg>
              </div>
              <h2 className="text-lg font-semibold mb-4">Add a new product</h2>
              <form className="flex flex-col gap-3" onSubmit={handleCreate}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" required />
                <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" />
                <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" required />
                <input type="number" name="price_offer" placeholder="Price offer" value={formData.price_offer} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" />
                <input type="number" name="percentage_offer" placeholder="Percentage offer" value={formData.percentage_offer} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" />
                <input type="text" name="photo" placeholder="Photo URL" value={formData.photo} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" required />
                <input type="number" name="stock_Available" placeholder="Stock Available" value={formData.stock_Available} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" required />

                <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" required>
                  <option value="">Select a category</option>
                  {categories2?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>

                <select name="manufacturer_id" value={formData.manufacturer_id} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" required>
                  <option value="">Select a brand</option>
                  {manufacturers?.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>

                <button type="submit" className="bg-purple-500 text-white font-bold py-2 px-4 mt-2 rounded-md hover:bg-purple-600 focus:ring-2 focus:ring-purple-500">
                  Create Product
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Modal Editar */}
        {isModal2Open && selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="justify-end flex">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-6 h-6 cursor-pointer" onClick={() => toggleEditModal()} strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0" /></svg>
              </div>
              <h2 className="text-lg font-semibold mb-4">Edit product</h2>
              <form className="flex flex-col gap-3" onSubmit={handleEdit}>
                <input type="text" name="name" placeholder="Name" value={formDataEdit.name || ""} onChange={handleInputEditChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" required />
                <input type="text" name="description" placeholder="Description" value={formDataEdit.description || ""} onChange={handleInputEditChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" />
                <input type="number" name="price" placeholder="Price" value={formDataEdit.price || ""} onChange={handleInputEditChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" required />
                <input type="number" name="price_offer" placeholder="Price offer" value={formDataEdit.price_offer || ""} onChange={handleInputEditChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" />
                <input type="number" name="percentage_offer" placeholder="Percentage offer" value={formDataEdit.percentage_offer || ""} onChange={handleInputEditChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" />
                <input type="text" name="photo" placeholder="Photo URL" value={formDataEdit.photo || ""} onChange={handleInputEditChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" required />
                <input type="number" name="stock_Available" placeholder="Stock Available" value={formDataEdit.stock_Available || ""} onChange={handleInputEditChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" required />

                <select name="category_id" value={formDataEdit.category_id || ""} onChange={handleInputEditChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" required>
                  <option value="">Select a category</option>
                  {categories2?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>

                <select name="manufacturer_id" value={formDataEdit.manufacturer_id || ""} onChange={handleInputEditChange} className="border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-purple-500" required>
                  <option value="">Select a brand</option>
                  {manufacturers?.map((m) => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>

                <button type="submit" className="bg-purple-500 text-white font-bold py-2 px-4 mt-2 rounded-md hover:bg-purple-600 focus:ring-2 focus:ring-purple-500">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;