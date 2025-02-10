"use server";
import { revalidatePath } from "next/cache";

const createCustomer = async (formData) => {
  const creating_customer_name = formData.get("customer_name");
  // エラー③: customer_idは自動生成される形に変更するため、formDataからは削除する
  //const creating_customer_id = formData.get("customer_id");
  const creating_age = formData.get("age");
  const creating_gender = formData.get("gender");

  const body_msg = JSON.stringify({
    customer_name: creating_customer_name,
    // エラー③: customer_idは自動生成される形に変更するため、formDataからは削除する
    //customer_id: creating_customer_id,
    age: creating_age,
    gender: creating_gender,
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body_msg,
  });
  if (!res.ok) {
    throw new Error("Failed to create customer");
  }

  // バックエンドからのレスポンスを取得
  const createdCustomer = await res.json();
  console.log("createdCustomer:", createdCustomer);

  revalidatePath(`/customers`);

  // customer_idを返す
  return createdCustomer.customer_id;  
};

export default createCustomer;
