import React, { useEffect } from "react";

const CCAvenuePaymentForm = ({ encRequest, accessCode, link }) => {
  useEffect(() => {
    const form = document.getElementById("nonseamless");
    if (form) {
      form.submit();
    }
  }, []);

  return (
    <form id="nonseamless" method="post" name="redirect" action={link}>
      <input
        type="hidden"
        id="encRequest"
        name="encRequest"
        value={encRequest}
      />
      <input
        type="hidden"
        name="access_code"
        id="access_code"
        value={accessCode}
      />
    </form>
  );
};

export default CCAvenuePaymentForm;
