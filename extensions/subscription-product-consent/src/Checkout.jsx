import {
  Checkbox,
  reactExtension,
  useBuyerJourneyIntercept,
  useExtensionCapability,
  useApplyNoteChange,
  useCartLines,
  useShippingAddress,
} from "@shopify/ui-extensions-react/checkout";
import { useState, useEffect } from "react";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

const productErrText = "You have product in your cart that can't be shipped to canada";
const errorText =
  "To continue with your purchase, agree to the deferred or recurring purchase terms.";
const consentText =
  "I understand that I'm agreeing to a subscription. It will renew at the price and frequency listed until it ends or is cancelled.";

function Extension() {
  const [isSubscription, setSubscription] = useState(false);
  const [error, setError] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [isAllowed, setAllowed] = useState(false);
  const [isNotAllowed, setNotAllowed] = useState(false);
  const [variantNotAllowed, setVariantNotAllowed] = useState(false);
  const cartLines = useCartLines();
  const noteChange = useApplyNoteChange();
  const { countryCode } = useShippingAddress()
  //Check if cart has subscription product
  useEffect(() => {
    for (const item of cartLines) {
      const subtitle = item.merchandise.subtitle;
      if (subtitle && subtitle.includes("Membership")) {
        setSubscription(true);
        break;
      }
    }
    for (const cart_item of cartLines) {
      const cart_item_title = cart_item.merchandise.title;
      const cart_item_subtitle = cart_item.merchandise.subtitle;
      if (!(cart_item_title === "Akkermansia" || cart_item_title === "Butyricum" || cart_item_title === "Metabolic Daily" || cart_item_title === "Polyphenol Booster 3 Month Supply")) {
        setNotAllowed(true);
      }
      if ((cart_item_title === "Akkermansia" || cart_item_title === "Butyricum" || cart_item_title === "Metabolic Daily" || cart_item_title === "Polyphenol Booster 3 Month Supply")) {
        setAllowed(true);
      }
      if (cart_item_subtitle && !(cart_item_subtitle.includes('Membership (3-month supply)') || cart_item_subtitle.includes('Single Bottle'))) {
        // console.log(cart_item_subtitle, 'csb');
        setVariantNotAllowed(true)
      }
    }
  }, [cartLines]);
  //block progress if consent not provided or conditions not matched
  const canBlockProgress = useExtensionCapability("block_progress");
  // Use the `buyerJourney` intercept to conditionally block checkout progress
  useBuyerJourneyIntercept(({ canBlockProgress }) => {
    // Validate that the consent
    if (canBlockProgress && isAllowed && isNotAllowed && countryCode == "CA") {
      // console.log('invalid')
      return {
        behavior: "block",
        reason: errorText,
        perform: (result) => {
          if (result.behavior === "block") {
            setError(productErrText);
          }
        },
      };
    } else if (countryCode == "CA" && (isNotAllowed || variantNotAllowed)) {
      // console.log('ca invalid')
      return {
        behavior: "block",
        reason: errorText,
        perform: (result) => {
          if (result.behavior === "block") {
            setError(productErrText);
          }
        },
      };
    } else if (canBlockProgress && !isChecked && isSubscription) {
      // console.log('not allowed')
      return {
        behavior: "block",
        reason: errorText,
        perform: (result) => {
          if (result.behavior === "block") {
            setError(errorText);
          }
        },
      };
    }
    // console.log('allowed')
    return {
      behavior: "allow",
      perform: () => {
        setError("");
      },
    };
  });
  
  //if consent given, by selecting checkbox then add note for order else set show error
  const handleChange = async (value) => {
    setChecked(value);
    value ? setError("") : setError(errorText);
    if (value) {
      try {
        let fecha = new Date(
          new Date().toLocaleString("en", { timeZone: "America/Los_Angeles" })
        );
        let formattedFecha = fecha.toString().split("GMT")[0];
        const result = await noteChange({
          type: "updateNote",
          note: `One or more of the items in your cart is a membership purchase. By continuing, I agree to the cancellation policy and authorize you to charge my payment method at the prices, frequency and dates listed on this page until my order is fulfilled or I cancel, if permitted. -- Timestamp ${formattedFecha} `,
        });
      } catch (err) {
        // console.log("err", error);
      }
    }
  };
  //if cart includes any subscription product then show consent checkbox 
  return isSubscription ? (
    <Checkbox
      id="subscription-product-consent"
      name="SubscriptionProductConsent"
      checked={isChecked}
      error={error}
      required={canBlockProgress}
      onChange={handleChange}
    >
      {consentText}
    </Checkbox>
  ) : null;
}
