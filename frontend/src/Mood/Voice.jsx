import React from 'react'
import "./Voice.css"
import bg2 from "../images/bg2.webp"

const Voice = () => {
    return (

        <div>
            <div class="grid grid-rows-3 grid-flow-col gap-4">
                <div class="row-span-3 ">
                    <img src={bg2} alt="" className='photo' />
                </div>
                <div class="col-span-2 language">Select Language</div>
                <div class="row-span-2 col-span-2 ...">
                    <div className="max-w-lg mx-auto">
                        <fieldset className="mb-5">
                            <legend className="sr-only">
                                Countries
                            </legend>
                            <div className="flex items-center mb-4">
                                <input id="country-option-1" type="radio" name="countries" defaultValue="USA" className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300" aria-labelledby="country-option-1" aria-describedby="country-option-1" defaultChecked />
                                <label htmlFor="country-option-1" className="text-sm font-medium text-gray-900 ml-2 block">
                                    United States
                                </label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input id="country-option-2" type="radio" name="countries" defaultValue="Germany" className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300" aria-labelledby="country-option-2" aria-describedby="country-option-2" />
                                <label htmlFor="country-option-2" className="text-sm font-medium text-gray-900 ml-2 block">
                                    Germany
                                </label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input id="country-option-3" type="radio" name="countries" defaultValue="Spain" className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300" aria-labelledby="country-option-3" aria-describedby="country-option-3" />
                                <label htmlFor="country-option-3" className="text-sm font-medium text-gray-900 ml-2 block">
                                    Spain
                                </label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input id="country-option-4" type="radio" name="countries" defaultValue="United Kingdom" className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300" aria-labelledby="country-option-4" aria-describedby="country-option-4" />
                                <label htmlFor="country-option-4" className="text-sm font-medium text-gray-900 ml-2 block">
                                    United Kingdom
                                </label>
                            </div>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Voice
