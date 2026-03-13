import React from "react";
import { useNavigate } from "react-router-dom";
import "./BuyerTypeSelect.css";

function BuyerTypeSelect() {

const navigate = useNavigate();

const selectType = (type) => {
  localStorage.setItem("buyerType", type);
  navigate("/buyer-dashboard/profile");
};

return (

<div className="buyer-type-page">

<h2 className="title">Choose Your Buyer Type</h2>

<p className="subtitle">
Select how you want to purchase crops
</p>

<div className="type-cards">

<div
className="type-card"
onClick={()=>selectType("B2B")}
>

<img
src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
alt="B2B"
/>

<h3>B2B Buyer</h3>

<p>
Bulk purchasing for businesses, wholesalers and retailers.
</p>

</div>


<div
className="type-card"
onClick={()=>selectType("B2C")}
>

<img
src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
alt="B2C"
/>

<h3>B2C Buyer</h3>

<p>
Buy fresh crops directly from farmers for personal use.
</p>

</div>

</div>

</div>

);

}

export default BuyerTypeSelect;