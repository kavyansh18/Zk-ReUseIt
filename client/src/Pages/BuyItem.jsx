import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import MyContractABI from "../abis/abi.json";
import Navbaar from "../Components/UI/Navbaar";
import { Reclaim } from '@reclaimprotocol/js-sdk'
import QRCode from "react-qr-code";

const contractABI = MyContractABI;
const contractAddress = "0x3e8bfE7377dd7df1b98DeF3e8Ae68Bcf41d6465D";

const BuyItem = () => {

  const [url, setUrl] = useState('')
  
  const APP_ID = "0x2E077cAa343478Bd397615FcdF89CaF61CdCEA15" 
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
        '0x6f3aaaa76e9ceab76d04949ce2bd047977c162a0234eaa5d1999ecd70cb7229e'
      );
      reclaimClient.setSignature(signature);
  
      const { requestUrl, statusUrl } = await reclaimClient.createVerificationRequest();
  
      setUrl(requestUrl);
  
      await reclaimClient.startSession({
        onSuccessCallback: proofs => {
          console.log('Verification success', proofs);
        },
        onFailureCallback: error => {
          console.error('Verification failed', error);
        }
      });
    } catch (error) {
      console.error('Error in generateVerificationRequest:', error);
    }
  }


// Prototype


// const getVerificationReq = async () => {
//   const APP_ID = "0xe616742f289737681050cae4084e49E6847ddac6";
//   const reclaimClient = new Reclaim.ProofRequest(APP_ID);

//   const providerIds = [
//   '5e1302ca-a3dd-4ef8-bc25-24fcc97dc800', // Aadhaar Card Date of Birth
//   ];

//   await reclaimClient.buildProofRequest(providerIds[0])

//   const APP_SECRET ="0x8b6f43e1d1312dfbbc4c3ce82c59d1be7398c1d13b6f4de82c3e0b7b84cac5bb"  // your app secret key.
//   reclaimClient.setSignature(
//       await reclaimClient.generateSignature(APP_SECRET)
//   )

//   const { requestUrl, statusUrl } =
//     await reclaimClient.createVerificationRequest()


//   await reclaimClient.startSession({
//     onSuccessCallback: proof => {
//       console.log('Verification success', proof)
//       // Your business logic here
//     },
//     onFailureCallback: error => {
//       console.error('Verification failed', error)
//       // Your business logic here to handle the error
//     }
//   })
// };


// call when user clicks on a button
// onClick={getVerificationReq}

  // async function handleQRCode() {
  //   try {
  //     console.log('URL before fetch:', url); // Check if `url` is a string
  
  //     const response = await fetch('http://localhost:5001/callback/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ requestUrl: url }), // Ensure url is a string
  //     });
  
  //     const result = await response.json();
  //     if (result.success) {
  //       console.log('Verification success', result.data);
  //     } else {
  //       console.error('Verification failed', result.error);
  //     }
  //   } catch (error) {
  //     console.error('Error handling QR code request', error);
  //   }
  // }
  
      
  return (
    <div>
      <Navbaar />

      <div className="mt-24"  style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}>
      {!url && (
        <button className="text-white" onClick={generateVerificationRequest}>
          Create Claim QrCode
        </button>
      )}
      {url && (
        <QRCode value={url} />
      )}
    </div>

    </div>
  );
};

export default BuyItem;
