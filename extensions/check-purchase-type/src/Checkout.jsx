import {
  reactExtension,
  useCartLines,
  useApplyAttributeChange
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

import React, { useEffect, useState } from 'react';



function Extension() {
  const applyAttributeChange = useApplyAttributeChange();
  const [is_quiz, setQuiz] = useState(0);
  const [addon_track, setAddon] = useState(0);
  const [addon_track_product_title, setaddonTitle] = useState(0);
  const [lock, setLock] = useState(0);
  
  if(!lock){
    let cartLines = useCartLines();
    let linesLength = cartLines.length;
    for(var i=0 ; i<linesLength ; ++i){
      let lineAttributes = cartLines[i].attributes;
      for(var j=0; j<lineAttributes.length; ++j){
        if(lineAttributes[j].key == "is_quiz"){
          
          setQuiz(cartLines[i].merchandise.title);
          
        }
        if(lineAttributes[j].key == "addon_track"){
          setAddon(lineAttributes[j].value);
          setaddonTitle(cartLines[i].merchandise.title);
        }
      }
    }
    setLock(1);
  }


  useEffect(async() => {

    await applyAttributeChange({
      type: 'updateAttribute',
      key: "is_quiz",
      value: is_quiz
    });

    await applyAttributeChange({
      type: 'updateAttribute',
      key: "addon_track",
      value: addon_track
    });

    await applyAttributeChange({
      type: 'updateAttribute',
      key: "addon_track_product_title",
      value: addon_track_product_title
    });

  }, [lock]);

  return (
   null
  );
}