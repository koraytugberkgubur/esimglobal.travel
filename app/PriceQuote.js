"use client";
import { useSyncExternalStore } from 'react';
import snapshot from '../data/provider-prices.json';
import { checkedText as formatChecked, hasCurrentPrice as current, priceText as formatPrice } from './pricePolicy';
const buildTime=Date.parse(snapshot.generatedAt);
let now=buildTime,timer;
const listeners=new Set();
function update(){now=Date.now();for(const listener of listeners)listener();}
function subscribe(listener){listeners.add(listener);if(!timer)timer=setInterval(update,60000);queueMicrotask(update);return()=>{listeners.delete(listener);if(!listeners.size){clearInterval(timer);timer=undefined;}};}
export function usePricePresentation(){
  const clock=useSyncExternalStore(subscribe,()=>now,()=>buildTime);
  return {now:clock,priceText:plan=>formatPrice(plan,clock),checkedText:plan=>formatChecked(plan,clock),hasCurrentPrice:plan=>current(plan,clock)};
}
export default function PriceQuote({plan}){const {priceText}=usePricePresentation();return priceText(plan);}
