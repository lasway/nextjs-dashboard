'use client'

import { Button } from '@/app/ui/button';
import { Slidder } from '@/app/ui/Slidder';
import Image from 'next/image';
import { number } from 'zod';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '../lib/actions';
export default function LoginPage() {

    const [errorMessage, dispatch] = useFormState(authenticate, undefined)

    const { pending } = useFormStatus()

    return (
        <main className="h-screen relative overflow-hidden bg-gradient-to-r from-primary via-white to-transparent">
            <div className="absolute w-full h-full inset-0 z-0">
                <div className="w-full h-full relative flex">
                    <Image src="/background-art.svg" className='lg:w-1/2 lg:h-screen scale-150 hidden lg:block absolute opacity-90 left-5 inset-y-0' alt='' width={100} height={100} />
                    <Image src="/background-art.svg" className='lg:w-1/2 lg:h-full absolute opacity-20 w-full h-full object-cover lg:opacity-[0.07] -right-8 inset-y-0' alt='' width={100} height={100} />
                </div>
            </div>
            <div className="flex items-center justify-center relative py-20 w-full h-full gap-10 px-10">
                <Slidder />
                <div className="flex flex-1 items-center justify-center  rounded w-96">
                    <div className="flex flex-col items-center justify-center space-y-7">
                        <svg className='w-24 h-24' viewBox="0 0 99 98" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="49.5" cy="49" r="49" fill="#00519D" />
                            <path d="M61.0908 21.0318C59.6365 21.1835 58.3563 21.5877 56.5539 22.4693C54.729 23.3565 54.1844 23.8674 39.3102 38.7416C24.9527 53.1047 23.9757 54.1267 23.1446 55.6932C21.6342 58.5288 21.1345 62.0045 21.769 65.177C22.0666 66.665 22.7179 68.3326 23.4535 69.5174C25.7556 73.2064 29.5626 75.5423 33.9254 75.9465C36.5477 76.188 39.4338 75.604 41.7977 74.3463C43.3586 73.5153 44.403 72.5214 58.8055 58.1245C73.2697 43.6547 74.0727 42.8124 74.9374 41.1335C77.7561 35.6533 76.7061 28.9771 72.3545 24.7658C70.2096 22.6939 67.8906 21.6046 64.5553 21.1161C63.8646 21.0094 61.7534 20.9645 61.0908 21.0318ZM59.6141 25.8046C59.9004 25.9506 60.5181 26.5233 60.6865 26.7985C60.8438 27.0511 60.8381 27.461 60.6753 27.7811C60.2261 28.6626 59.4063 29.5554 54.8469 34.1204C48.8894 40.0723 48.1763 40.7068 47.525 40.6057C46.6883 40.4766 45.9079 39.6287 45.818 38.7528C45.745 38.0678 46.1325 37.5736 49.2039 34.4236C51.259 32.318 55.7846 27.8372 56.8346 26.8714C57.4242 26.3268 58.0475 25.8439 58.3226 25.7204C58.609 25.5912 59.2884 25.6361 59.6141 25.8046ZM42.8926 45.255C44.1054 46.4397 47.2218 49.5392 49.8159 52.1333L54.5325 56.8555L50.2932 61.1005C45.1723 66.2214 42.2076 69.085 41.1014 69.9778C39.2822 71.4377 36.7161 72.2294 34.442 72.0217C32.7631 71.8757 31.2752 71.3759 29.9556 70.5281C26.4519 68.2596 24.7898 64.2505 25.677 60.2302C25.8679 59.3879 26.0813 58.7703 26.4856 57.9505C26.8337 57.2261 27.0358 56.9735 28.4452 55.4518C32.7631 50.797 40.3434 43.0988 40.6073 43.0988C40.6466 43.0988 41.6741 44.0702 42.8926 45.255Z" fill="#FFC50C" />
                        </svg>

                        <div className="space-y-3 text-center">
                            <h1 className='text-3xl font-bold'>Sign in to your account</h1>
                            <p className='text-sm'>Or <a href="#" className='text-primary font-bold'>request access from the administrator</a></p>
                        </div>

                        <form action={dispatch} className='space-y-2 w-full'>
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border border-gray-200 py-2 px-6 text-sm outline-2 placeholder:text-gray-500"
                                    id="email"
                                    type="text"
                                    name="email"
                                    placeholder="Enter your user name"
                                    required
                                />
                            </div>
                            <div className="">
                                <div className="relative">
                                    <input
                                        className="peer block w-full rounded-md border border-gray-200 py-2 px-6 text-sm outline-2 placeholder:text-gray-500"
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Enter password"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-5">
                                <label className="flex space-x-2 items-center">
                                    <input
                                        className="peer block rounded-sm border border-gray-200 outline-2"
                                        id="remember"
                                        type="checkbox"
                                        name="remember"
                                    />
                                    <span className='text-sm'>Remember me</span>
                                </label>

                                <a href="#" className='font-semibold text-primary text-sm'>Forgot your password?</a>
                            </div>

                            <Button className="w-full justify-between" aria-disabled={pending}>
                                <LockClosedIcon className="text-left h-5 w-5 text-gray-50" />
                                <span className='flex-1 text-center'>Log in</span>
                            </Button>
                            <div
                                className="flex h-8 items-end space-x-1"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {errorMessage && (
                                    <>
                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                                        <p className="text-sm text-red-500">{errorMessage}</p>
                                    </>
                                )}
                            </div>
                        </form>

                    </div>
                </div>
            </div >
        </main >
    );
}
