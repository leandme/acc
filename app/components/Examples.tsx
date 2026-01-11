export default function Examples() {
  const images = [
      "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
      "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
      "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp",
      "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp",
      "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp",
      "https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp",
      "https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp",
      "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
      "https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp",
      "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp",
      "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp",
      "https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp",
      "https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp",
      "https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp",
  ];

  return (
    <div id="examples" className="flex flex-col mt-40 gap-8 items-center">
      <h2 className="text-3xl lg:text-4xl font-bold">17,490 Body Fat Estimates...</h2>
      <div className="flex justify-center mt-10">
            <p className="text-xs lg:text-sm text-center text-gray-600 px-4 py-2 rounded-full">
              🔒 Your photos are private and used only to generate your estimate
            </p>
          </div>
      <div className="carousel rounded-box">
          {images.map((src, index) => (
              <div key={index} className="carousel-item">
                  <img src={src} alt="Burger" />
              </div>
          ))}
      </div>
    </div>
  );
}
