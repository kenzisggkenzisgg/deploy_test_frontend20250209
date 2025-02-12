"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import fetchCustomer from "./fetchCustomer";
import updateCustomer from "./updateCustomer";

export default function UpdatePage({ params }) { 
  const router = useRouter();
  const id = params?.id || "";  // 修正: `undefined` の場合のデフォルト値を設定
  const formRef = useRef();
  const [customerInfo, setCustomerInfo] = useState({}); // 修正: 初期値を `{}` に変更

  useEffect(() => {
    const fetchAndSetCustomer = async () => {
      if (!id) return;

      try {
        const customerData = await fetchCustomer(id);
        if (!customerData) {
          console.warn("No customer data found for ID:", id);
          return;
        }
        console.log("Fetched customer data:", customerData);
        setCustomerInfo(customerData);
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };

    fetchAndSetCustomer();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      const response = await updateCustomer(formData);
      console.log("Update response:", response);

      if (!response || response.status !== 200) {
        throw new Error(`Failed to update customer: ${response?.detail || "Unknown error"}`);
      }

      router.push(`./${formData.get("customer_id")}/confirm`);
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("更新に失敗しました。");
    }
  };

  // 修正: `?.` を使って `undefined` の可能性を考慮
  const previous_customer_name = customerInfo?.customer_name ?? "";
  const previous_customer_id = customerInfo?.customer_id ?? "";
  const previous_age = customerInfo?.age ?? 0;
  const previous_gender = customerInfo?.gender ?? "";

  return (
    <div className="card bordered bg-white border-blue-200 border-2 max-w-md m-4">
      <div className="m-4 card bordered bg-blue-200 duration-200 hover:border-r-red">
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="card-body">
            <h2 className="card-title">
              <p>
                <input type="text" name="customer_name" defaultValue={previous_customer_name} className="input input-bordered" />
                さん
              </p>
            </h2>
            <p>
              Customer ID:
              <input type="text" name="customer_id" defaultValue={previous_customer_id} className="input input-bordered" readOnly />
            </p>
            <p>
              Age:
              <input type="number" name="age" defaultValue={previous_age} className="input input-bordered" />
            </p>
            <p>
              Gender:
              <input type="text" name="gender" defaultValue={previous_gender} className="input input-bordered" />
            </p>
          </div>
          <div className="flex justify-center">
            <button className="btn btn-primary m-4 text-2xl">更新</button>
          </div>
        </form>
      </div>
    </div>
  );
}



