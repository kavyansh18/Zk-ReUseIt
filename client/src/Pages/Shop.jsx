import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MyContractABI from "../abis/abi.json";
import Navbaar from "../Components/UI/Navbaar";
import eth from "../assets/eth.png";
import Modal from "react-modal";
import "../index.css";
import { Reclaim } from '@reclaimprotocol/js-sdk'
import QRCode from "react-qr-code";
import camaro from '../assets/camaro.jpg'
import mac from '../assets/macbook.jpg'
import bike from '../assets/bike.jpeg'
import sofa from '../assets/sofa.png'
import bat from '../assets/bat.jpeg'
import af from '../assets/af.jpg'
import ip from "../assets/ip.jpeg"
import tv from "../assets/tv.webp"
import bd from "../assets/badminton.jpeg"

Modal.setAppElement("#root"); 

const contractABI = MyContractABI;
const contractAddress = "0x7582993721F6EB18418D987221Ca5Aacb3246E6F";

const Shop = () => {
  const [searchName, setSearchName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fetchedItems, setFetchedItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [addressModalIsOpen, setAddressModalIsOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const imageMapping = {
    1: camaro,
    2: mac,
    3: bike,
    4: sofa,
    5: bat,
    6: af,
    7: ip,
    8: tv,
    9: bd,
    // Add more mappings as needed
  };

  useEffect(() => {
    fetchAllItems();
  }, []);

  async function fetchAllItems() {
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const items = await contract.getAllItems();
      const formattedItems = items.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        category: item.category,
        cost: ethers.utils.formatEther(item.cost.toString()),
      }));

      setAllItems(formattedItems);
    } catch (error) {
      console.error("Error fetching all items:", error);
      toast.error("Error fetching all items");
    }
    setLoading(false);
  }

  async function fetchItemsByName(name) {
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const items = await contract.getAllItems();
      const matchingItems = items
        .map((item) => ({
          id: item.id.toString(),
          name: item.name,
          category: item.category,
          cost: ethers.utils.formatEther(item.cost.toString()),
        }))
        .filter(
          (item) =>
            item.name.toLowerCase() === name.toLowerCase() &&
            (selectedCategory === "" || item.category === selectedCategory)
        );

      if (matchingItems.length > 0) {
        setFetchedItems(matchingItems);
        console.log("Fetched Items:", matchingItems);
      } else {
        console.error("Items not found");
        setFetchedItems([]);
        toast.error("Items not found");
      }
    } catch (error) {
      console.error("Error fetching items by name:", error);
      toast.error("Error fetching items by name");
    }
    setLoading(false);
  }

  async function fetchItemsByCategory(category) {
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      const items = await contract.getAllItems();
      const filteredItems = items
        .map((item) => ({
          id: item.id.toString(),
          name: item.name,
          category: item.category,
          cost: ethers.utils.formatEther(item.cost.toString()),
        }))
        .filter((item) => item.category === category);

      if (filteredItems.length > 0) {
        setFetchedItems(filteredItems);
        console.log("Fetched Items by Category:", filteredItems);
      } else {
        console.error("Items not found for category");
        setFetchedItems([]);
        toast.error("Items not found for category");
      }
    } catch (error) {
      console.error("Error fetching items by category:", error);
      toast.error("Error fetching items by category");
    }
    setLoading(false);
  }

  async function handleSearch() {
    if (searchName.trim() !== "") {
      await fetchItemsByName(searchName);
    } else {
      // Fetch all items if no name is provided
      fetchAllItems();
    }
  }

  async function handleCategoryChange(event) {
    const category = event.target.value;
    setSelectedCategory(category);

    if (category === "") {
      // If no category selected, show all items
      fetchAllItems();
    } else {
      // Fetch items by selected category
      await fetchItemsByCategory(category);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return signer;
      } catch (error) {
        console.error("User denied account access");
        toast.error("User denied account access");
      }
    } else {
      console.error("Metamask is not installed");
      toast.error("Metamask is not installed");
    }
  }

  async function buyItem(id, cost) {
    setLoading(true); // Set loading to true before starting the transaction
    const signer = await connectToMetamask();
    if (!signer) {
      setLoading(false); // Set loading to false if no signer is returned
      return;
    }
  
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
    try {
      const tx = await contract.buy(id, {
        value: ethers.utils.parseEther(cost),
      });
      console.log("Transaction sent:", tx);
  
      const receipt = await tx.wait(); // Wait for the transaction to be mined
      console.log("Transaction mined:", receipt);
  
      toast.success("Transaction successful!");
      toast.success("Your order will be delivered within 7 days");
    } catch (error) {
      console.error("Error buying item:", error.message);
      toast.error("Error buying item: " + error.message);
    } finally {
      setLoading(false); // Set loading to false after transaction is completed or if an error occurs
    }
  }
  

  // Function to split the name and add description with reduced gap
  function formatItemName(name) {
    const formattedName = name.replace(/^Macbbok/, 'Macbook');
    const [firstWord, ...rest] = formattedName.split(" ");
    const description = rest.join(" ");
    return (
      <>
        <span
          className="bg-gradient-to-r from-slate-300 to-slate-500 bg-clip-text text-transparent"
          style={{ fontSize: "1.5rem", fontWeight: "bold" }}
        >
          {firstWord}
        </span>
        <br />
        <span
          className="pb-1 bg-gradient-to-r from-slate-300 to-slate-500 bg-clip-text text-transparent"
          style={{ fontSize: "0.9rem", lineHeight: "1" }}
        >
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Description:
          </span>{" "}
          {description}
        </span>
      </>
    );
  }

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
    setUrl("")
  }

  const [url, setUrl] = useState('')
  
  const APP_ID = "0xdc7093e23DeCc442c52Ab51182fE452b0C3955F2" 
  const reclaimClient = new Reclaim.ProofRequest(APP_ID)
 
  async function generateVerificationRequest() {
    try {
      const providerId = '1bba104c-f7e3-4b58-8b42-f8c0346cdeab';
  
      reclaimClient.addContext(
        ('user\'s address'), 
        ('for acmecorp.com on 1st january')
      );
  
      await reclaimClient.buildProofRequest(providerId);
  
      const signature = await reclaimClient.generateSignature(
        '0xea349edefacc4eaee64c63e917bcb62ff3280cc74d06d411ffbc5651bd9a9576'
      );
      reclaimClient.setSignature(signature);
  
      const { requestUrl, statusUrl } = await reclaimClient.createVerificationRequest();
  
      setUrl(requestUrl);
  
      await reclaimClient.startSession({
        onSuccessCallback: proofs => {
          setSuccessMessage('Verification successful!');
     
        },
        onFailureCallback: error => {
          setSuccessMessage('Verification Failed!');
    
        }
      });
    } catch (error) {
      console.error('Error in generateVerificationRequest:', error);
    }
  }

  function openAddressModal(item) {
    setSelectedItem(item);
    setAddressModalIsOpen(true);
  }

  function closeAddressModal() {
    setAddressModalIsOpen(false);
    setDeliveryAddress("");
  }

  return (
    <div className="p-4">
      <Navbaar />
      <ToastContainer />
      <div className="pt-16 mb-4 flex justify-center items-center">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="peer h-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-white outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="mr-8 ml-2 inline-block rounded-3xl bg-blue-500 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-lg transition duration-150 ease-in-out hover:bg-blue-600 hover:shadow-xl focus:bg-blue-600 focus:shadow-xl focus:outline-none active:bg-blue-700"
        >
          Search
        </button>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="ml-2  border border-blue-gray-200 bg-transparent px-3 py-2 rounded-lg text-sm font-normal  outline outline-0 transition-all focus:border-2 focus:border-blue-500 focus:outline-0 bg-black text-white"
        >
          <option value="" disabled>
            Select a category
          </option>
          <option value="Automobile" className="bg-black text-white p-1">Automobile</option>
          <option value="Electronics" className="bg-black text-white p-1">Electronics</option>
          <option value="Furniture" className="bg-black text-white p-1">Furniture</option>
          <option value="Action figures" className="bg-black text-white p-1">Action figures</option>
          <option value="Vintage" className="bg-black text-white p-1">Vintage</option>
          <option value="Sports" className="bg-black text-white p-1">Sports</option>
          <option value="Others" className="bg-black text-white p-1">Others</option>
        </select>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-3">
        {loading && <span className="loader "></span>}
        {!loading && fetchedItems.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {fetchedItems.map((item) => (
              <div
                key={item.id}
                className="text-white cardd p-4 rounded-lg shadow-lg max-w-sm flex flex-col justify-center items-center"
              >
                <img
                  src={imageMapping[item.id] || eth}
                  alt="Sample"
                  className="w-60 object-cover mb-2 rounded"
                />
                {formatItemName(item.name)}
                <p className="text-lg">Category: {item.category}</p>
                <p className="text-lg mt-1">{item.cost} ETH</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openAddressModal(item)}
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 mt-3"
                  >
                    <span className="relative px-6 py-1.5 transition-all ease-in duration-75 bg-gray-600 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Buy
                    </span>
                  </button>
                  <button
                    onClick={openModal}
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 mt-3"
                  >
                    <span className="relative px-6 py-1.5 transition-all ease-in duration-75 bg-gray-600 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Generate Proof
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && allItems.length > 0 && fetchedItems.length === 0 && (
          <div className="grid grid-cols-3 gap-12 px-16">
            {allItems.map((item) => (
              <div
                key={item.id}
                className="text-white cardd p-4 rounded-lg shadow-lg max-w-sm flex flex-col justify-center items-center"
              >
                <img
                  src={imageMapping[item.id] || eth}
                  alt="Sample"
                  className="w-60 object-cover mb-2 rounded"
                />
                {formatItemName(item.name)}
                <p className="text-lg bg-gradient-to-r from-slate-300 to-slate-500 bg-clip-text text-transparent">
                  <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    Category:
                  </span>{" "}
                  {item.category}
                </p>
                <p className="text-lg mt-1 bg-gradient-to-r from-slate-300 to-slate-500 bg-clip-text text-transparent">
                  {item.cost} ETH
                </p>
                <div className="flex gap-2">
                  <button
                    // onClick={() => buyItem(item.id, item.cost)}
                    onClick={() => openAddressModal(item)}
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 mt-3"
                  >
                    <span className="relative px-6 py-1.5 transition-all ease-in duration-75 bg-gray-600 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Buy
                    </span>
                  </button>
                  <button
                    onClick={openModal}
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 mt-3"
                  >
                    <span className="relative px-6 py-1.5 transition-all ease-in duration-75 bg-gray-600 dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Generate Proof
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Proof Modal"
        className="modal bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-0 border border-gray-100 p-20 "
        overlayClassName="overlay"
      >
        <button onClick={closeModal} type="button" class=" close-button mb-2 bg-white rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span class="sr-only">Close menu</span>
             
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        {!url && (
        <button className="text-white" onClick={generateVerificationRequest}>
          Create Claim QrCode
        </button>
      )}
      {url && (
        <div>
        <QRCode value={url} />
        <div className="text-white flex justify-center items-center pt-3">Scan this to generate proof using (Reclaim Protocal)</div>
        {successMessage && (
        <div className="text-green-500 flex justify-center items-center pt-3">{successMessage}</div>
      )}
        </div>
      )}
      </Modal>

      <Modal
            isOpen={addressModalIsOpen}
            onRequestClose={closeAddressModal}
            contentLabel="Enter Delivery Address Modal"
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
          >
            <form>
            <div className="bg-black p-8 rounded-md shadow-md text-center cardd">
              <h2 className="text-2xl font-semibold mb-4">
                Enter Delivery Address
              </h2>
              <input
                type="text"
                placeholder="Enter delivery address"
                className="text-white p-2 border border-gray-300 rounded w-full mb-4 bg-gray-800"
                value={deliveryAddress}
                required
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-3xl"
                onClick={() => {
                  if (!deliveryAddress.trim()) {
                    toast.error("Please enter a delivery address.");
                  } else if (!selectedItem) {
                    toast.error("No item selected.");
                  } else {
                    buyItem(selectedItem.id, selectedItem.cost);
                    closeAddressModal();
                  }
                }}
              >
                Place Order
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-3xl mt-4 ml-3"
                onClick={closeAddressModal}
              >
                Cancel
              </button>
            </div>
            </form>
          </Modal>
    </div>
  );
};

export default Shop;
