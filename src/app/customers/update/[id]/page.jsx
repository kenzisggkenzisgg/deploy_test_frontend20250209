"use client";
import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import fetchCustomer from "./fetchCustomer";
import updateCustomer from "./updateCustomer";

export default function UpdatePage(props) {
  const params = use(props.params);
  const router = useRouter();
  const id = params.id;
  const formRef = useRef();
  const [customerInfo, setCustomerInfo] = useState([]);

  useEffect(() => {
    const fetchAndSetCustomer = async () => {
      const customerData = await fetchCustomer(id);
      setCustomerInfo(customerData);
    };
    fetchAndSetCustomer();
  }, []);


//20250216　formData.get("customer_id") の値が null になる可能性があるため、明示的に customerInfo.customer_id から取得するように修正。
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const customerID = formData.get("customer_id")?.trim() || customerInfo.customer_id; // `customerInfo` からも取得
    console.log("Extracted customer_id:", customerID); // 🔍 デバッグ
  
    if (!customerID) {
      console.error("Customer ID is missing.");
      return;
    }
  
    await updateCustomer(formData);
    router.push(`./${customerID}/confirm`);
  };


  //20250216コメントアウト
  /*
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    console.log("Submitting Form Data:", Object.fromEntries(formData)); // 🔍 デバッグ
    console.log("Extracted customer_id:", formData.get("customer_id")); // 🔍 デバッグ
    await updateCustomer(formData);
    router.push(`./${formData.get("customer_id")}/confirm`);
  };
  */
 
  /*
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);
    const customerID = formData.get("customer_id").trim();　//Customer IDを取得して空白を撤去（20250128追記）
  }
*/


  const previous_customer_name = customerInfo.customer_name;
  //const previous_customer_id = customerInfo.customer_id;
  const previous_customer_id = customerInfo?.customer_id ?? ""; //20250209修正
  const previous_age = customerInfo.age;
  const previous_gender = customerInfo.gender;

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
                {/*
                <span className="font-bold">{previous_customer_id}</span>
                <input
                  type="hidden" //"text"を"hidden"に変更。ユーザーには見えないが、フォームデータに含まれてサーバーに送信される。
                  name="customer_id"
                  defaultValue={previous_customer_id}
                  className="input input-bordered"                 
                />
                */}
                <input
                  type="text"
                  name="customer_id"
                  defaultValue={previous_customer_id}
                  className="input input-bordered"
                  readOnly //readOnly は「読み取り専用」を意味し、ユーザーは編集できませんが、FormData に含まれます。
                  disabled //20250216挿入
                  //disabled は、HTML の <input> 要素に適用できる属性の1つで、「無効化」を意味します。
                  //disabled がついている <input> は、フォームを submit したときに 値が送信されません。
                />                
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

