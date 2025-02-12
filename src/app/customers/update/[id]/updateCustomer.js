export default async function updateCustomer(formData) {
  const updated_customer_name = formData.get("customer_name");
  const updated_customer_id = formData.get("customer_id");
  const updated_age = parseInt(formData.get("age"));
  const updated_gender = formData.get("gender");

  const body_msg = JSON.stringify({
    customer_name: updated_customer_name,
    customer_id: updated_customer_id,
    age: updated_age,
    gender: updated_gender,
  });

  // 環境変数の確認
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  if (!apiEndpoint) {
    console.error("❌ 環境変数 NEXT_PUBLIC_API_ENDPOINT が設定されていません！");
    throw new Error("API エンドポイントが設定されていません");
  }

  const url = `${apiEndpoint}/customers/${updated_customer_id}`;
  console.log(`🚀 Sending PUT request to: ${url}`);
  console.log("📡 Request Body:", body_msg);

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: body_msg,
    });

    // `res` が `undefined` の場合のチェック
    if (!res) {
      throw new Error("サーバーからのレスポンスがありません");
    }

    // ステータスコードのチェック
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // JSON のエラー防止
      console.error("⚠️ サーバーエラー:", errorData);
      throw new Error(errorData.message || `サーバーエラー (${res.status})`);
    }

    console.log("✅ Update successful:", await res.json());
    return res;
  } catch (error) {
    console.error("❌ Error in updateCustomer:", error);
    throw error;
  }
}

