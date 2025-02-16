"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import fetchCustomer from "./fetchCustomer";
import updateCustomer from "./updateCustomer";

export default function UpdatePage(props) {
  const params = props.params;
  const router = useRouter();
  const id = params.id;
  const formRef = useRef();
  const [customerInfo, setCustomerInfo] = useState({}); // ✅ 初期値をオブジェクトに変更

  useEffect(() => {
    const fetchAndSetCustomer = async () => {
      if (!id) return;
      try {
        const customerData = await fetchCustomer(id);
        if (!customerData) {
          console.error("Customer data not found");
          return;
        }
        setCustomerInfo(customerData);
      } catch (error) {
        console.error("Failed to fetch customer:", error);
      }
    };
    fetchAndSetCustomer();
  }, [id]); // ✅ 依存配列に `id` を追加

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);

    let customerID = formData.get("customer_id")?.trim() || customerInfo.customer_id;
    
    if (!customerID) {
      console.error("Error: customer_id is null or undefined");
      alert("顧客IDが不明です。フォームを再読み込みしてください。");
      return;
    }

    console.log("Extracted customer_id:", customerID); // ✅ デバッグ用ログ

    await updateCustomer(formData);
    router.push(`./${customerID}/confirm`);
  };

  const previous_customer_name = customerInfo?.customer_name ?? "";
  const previous_customer_id = customerInfo?.customer_id ?? "";
  const previous_age = customerInfo?.age ?? "";
  const previous_gender = customerInfo?.gender ?? "";

  return (
    <>
      <div className="card bordered bg-white border-blue-200 border-2 max-w-md m-4">
        <div className="m-4 card bordered bg-blue-200 duration-200 hover:border-r-red">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="card-body">
              <h2 className="card-title">
                <p>
                  <input
                    type="text"
                    name="customer_name"
                    defaultValue={previous_customer_name}
                    className="input input-bordered"
                  />
                  さん
                </p>
              </h2>
              <p>
                Customer ID:
                <span className="font-bold">{previous_customer_id}</span>
                <input type="hidden" name="customer_id" value={previous_customer_id} /> {/* ✅ `hidden` に変更 */}
              </p>
              <p>
                Age:
                <input
                  type="number"
                  name="age"
                  defaultValue={previous_age}
                  className="input input-bordered"
                />
              </p>
              <p>
                Gender:
                <input
                  type="text"
                  name="gender"
                  defaultValue={previous_gender}
                  className="input input-bordered"
                />
              </p>
            </div>
            <div className="flex justify-center">
              <button className="btn btn-primary m-4 text-2xl">更新</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
