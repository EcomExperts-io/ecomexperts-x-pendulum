import {
  Checkbox,
  reactExtension,
  useDeliveryGroups,
  useBuyerJourneyIntercept,
  useExtensionCapability
} from '@shopify/ui-extensions-react/checkout';
import { useState } from 'react';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);


function Extension() {

  const deliveryGroups = useDeliveryGroups()

  
  const SelectedDelivery = deliveryGroups.length && deliveryGroups[0].deliveryOptions.filter(({handle})=>handle == deliveryGroups[0].selectedDeliveryOption.handle)
  const [error, setError] = useState("")
  const [isChecked, setChecked] = useState(false)

  const errorText = "To continue with your purchase, agree to the international shipping terms."

  
  const canBlockProgress= useExtensionCapability("block_progress");
   // Use the `buyerJourney` intercept to conditionally block checkout progress
   useBuyerJourneyIntercept(({ canBlockProgress }) => {
    // Validate that the age of the buyer is known, and that they're old enough to complete the purchase
    if (canBlockProgress && !isChecked) {
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

    return {
      behavior: "allow",
      perform: () => {
        setError("")
      },
    };
  });

   
 const handleChange = (value)=>{
  setChecked((prev)=>!prev)
  value ? setError("") : setError(errorText)
 }


  return (
    SelectedDelivery[0].title === "International Economy" ?
    <Checkbox 
    id="shipping-consent" 
    name="ShippingConsent"
    error={error}
    required={canBlockProgress}
    onChange={handleChange}  
    >
      I understand that this item is non-refundable, that the customer is responsible for any customs fees and clearance, and that Pendulum will not be able to track the package once it departs from the U.S.    
    </Checkbox> :
    null
  );

}