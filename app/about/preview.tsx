"use client"

import Image from "next/image"

export default function AboutPreview() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">About Chef Margaret Alvis</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <Image
            src="/placeholder.svg?height=500&width=500&text=Chef+Margaret"
            alt="Chef Margaret Alvis"
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>
        <div className="md:w-1/2">
          <p className="text-lg mb-4">
            Chef Margaret Alvis is a renowned culinary expert with over 15 years of experience in the industry. She
            specializes in farm-to-table cuisine with a focus on seasonal ingredients and sustainable practices.
          </p>
          <p className="text-lg mb-4">
            After graduating from the Culinary Institute of America, Margaret worked in several Michelin-starred
            restaurants before starting her own private chef and catering business. She has been featured in numerous
            food publications and has appeared on several cooking shows.
          </p>
          <p className="text-lg mb-4">
            Margaret is passionate about sharing her knowledge and love for food through cooking classes and private
            dining experiences. She believes that good food brings people together and creates lasting memories.
          </p>
          <p className="text-lg mb-4">
            Based in Oak Cliff, Texas, Chef Margaret sources ingredients from local farmers and producers whenever
            possible, supporting the community while ensuring the freshest flavors for her clients.
          </p>
          <p className="text-lg">
            When she's not cooking for clients or teaching classes, Margaret enjoys exploring new restaurants,
            experimenting with recipes, and spending time with her family and her two rescue dogs.
          </p>
        </div>
      </div>
    </div>
  )
}
