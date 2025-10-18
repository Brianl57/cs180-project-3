"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function ProjectPage() {
  const [activeSection, setActiveSection] = useState("a1")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5, rootMargin: "-100px 0px -50% 0px" },
    )

    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 24
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sticky Sidebar TOC */}
        <aside className="sticky top-0 h-screen w-64 flex-shrink-0 overflow-y-auto border-r border-sidebar-border bg-sidebar p-6">
          <nav className="space-y-1">
            <div className="mb-6">
              <h1 className="text-lg font-bold text-sidebar-foreground">CS180 Project 3A</h1>
              <p className="text-sm text-sidebar-foreground/70">Image Warping and Mosaicing</p>
            </div>
            <h2 className="mb-4 text-sm font-semibold text-sidebar-foreground">Table of Contents</h2>
            {[
              { id: "a1", label: "A.1: Shoot the Pictures" },
              { id: "a2", label: "A.2: Recover Homographies" },
              { id: "a3", label: "A.3: Warp the Images" },
              { id: "a4", label: "A.4: Blend into a Mosaic" },
              { id: "b1", label: "B.1: Harris Corner Detection" },
              { id: "b2", label: "B.2: Feature Descriptor Extraction" },
              { id: "b3", label: "B.3: Feature Matching" },
              { id: "b4", label: "B.4: RANSAC for Robust Homography" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                  activeSection === item.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-8 py-12 max-w-5xl mx-auto">
          {/* Project Header */}
          <div className="mb-16">
            <h1 className="text-4xl font-bold text-foreground mb-4">CS180 Project 3A: Image Warping and Mosaicing</h1>
            <div className="text-muted-foreground mb-6 space-y-1">
              <p>
                <span className="font-medium">Author:</span> Brian Le
              </p>
              <p>
                <span className="font-medium">Published:</span> October 8, 2025
              </p>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground leading-relaxed">
                This project explores fundamental techniques in computational photography by computing homographies to
                align and warp images, then blending them into seamless panoramic mosaics. Through hands-on
                implementation, I demonstrate how projective transformations enable the creation of wide-angle views
                from multiple overlapping photographs.
              </p>
            </div>
          </div>

          {/* Section A.1: Shoot the Pictures */}
          <section id="a1" className="mb-20 scroll-mt-6">
            <h2 className="text-3xl font-bold text-foreground mb-6 pb-2 border-b border-border">
              A.1: Shoot the Pictures
            </h2>

            <div className="space-y-8">
              {/* Background/Goals */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Background & Goals</h3>
                <p className="text-foreground leading-relaxed">
                  To create panoramic mosaics using homography-based alignment, we need overlapping photographs that are
                  projectively related with a fixed center of projection. This means the camera must rotate around its
                  optical center without translating, ensuring that corresponding points in different images are related
                  by a homography matrix. I aimed for 40-70% overlap between adjacent images and avoided fisheye
                  distortion by using moderate focal lengths.
                </p>
              </div>

              {/* Results Gallery */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Input Image Sets</h3>

                {/* Set 1 */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-foreground mb-3">Set 1: Macbook</h4>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    {["macbook_left.jpg", "macbook_mid.jpg", "macbook_right.jpg"].map((img, i) => (
                      <div key={i} className="space-y-2">
                        <div className="aspect-[4/3] bg-muted rounded border border-border flex items-center justify-center">
                          <Image
                            src={img}
                            alt={`Set 1 Image ${i + 1}`}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">Image {i + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Set 2 */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-foreground mb-3">Set 2: Berkeley Waywest</h4>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    {["waywest_left.jpg", "waywest_mid.jpg", "waywest_right.jpg"].map((img, i) => (
                      <div key={i} className="space-y-2">
                        <div className="aspect-[4/3] bg-muted rounded border border-border flex items-center justify-center">
                          <Image
                            src={img}
                            alt={`Set 2 Image ${i + 1}`}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">Image {i + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Section A.2: Recover Homographies */}
          <section id="a2" className="mb-20 scroll-mt-6">
            <h2 className="text-3xl font-bold text-foreground mb-6 pb-2 border-b border-border">
              A.2: Recover Homographies
            </h2>

            <div className="space-y-8">
              {/* Background/Goals */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Background & Goals</h3>
                <p className="text-foreground leading-relaxed mb-4">
                  A homography is a projective transformation that maps points between two images of the same planar
                  surface or images taken from the same center of projection. Mathematically, it relates corresponding
                  points <strong>p</strong> and <strong>p&apos;</strong> as <strong>p&apos; ∼ Hp</strong>, where{" "}
                  <strong>H ∈ ℝ³ˣ³</strong> is the homography matrix with 8 degrees of freedom (scale is arbitrary). We
                  recover <strong>H</strong> from point correspondences by solving an overdetermined linear system{" "}
                  <strong>Ah = b</strong> using least squares.
                </p>
              </div>

              {/* Methods */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Methods</h3>
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    The homography recovery process involves several steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-foreground leading-relaxed ml-4">
                    <li>
                      <strong>Collect correspondences:</strong> Use a mouse-clicking tool to manually select matching
                      points in both images (minimum 4 pairs required, typically 8-12 for robustness)
                    </li>
                    <li>
                      <strong>Construct system matrix A:</strong> For each correspondence (x, y) → (u, v), create two
                      rows in the matrix based on the homography equations
                    </li>
                    <li>
                      <strong>Solve for h:</strong> Use least squares (SVD or normal equations) to find the homography
                      parameters that minimize reprojection error
                    </li>
                    <li>
                      <strong>Reshape to H:</strong> Convert the 8-element solution vector back into a 3×3 matrix with
                      the last element set to 1
                    </li>
                  </ol>

                  {/* Equation Block */}
                  <div className="bg-muted/50 border border-border rounded-lg p-6 my-6">
                    <h4 className="text-base font-semibold text-foreground mb-3">Homography Equations</h4>
                    <div className="space-y-3 text-foreground font-mono text-sm">
                      <p>For each correspondence (x, y) → (u, v):</p>
                      <div className="bg-background p-4 rounded border border-border">
                        <p className="mb-2">u = (h₁₁x + h₁₂y + h₁₃) / (h₃₁x + h₃₂y + 1)</p>
                        <p>v = (h₂₁x + h₂₂y + h₂₃) / (h₃₁x + h₃₂y + 1)</p>
                      </div>
                      <p className="mt-4">
                        Rearranged into linear form Ah = b where h contains the 8 unknown parameters.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Correspondence Points for Images</h3>

                {/* Set 1: Macbook Mid + Left */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-foreground mb-3">Macbook Mid + Left</h4>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="space-y-2">
                      <div className="aspect-[4/3] bg-muted rounded border border-border">
                        <Image
                          src="02_Macbook_Left_Corr_Pts.jpg"
                          alt="Macbook Left Correspondence Points"
                          width={700}
                          height={500}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">Left</p>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-[4/3] bg-muted rounded border border-border">
                        <Image
                          src="01_Macbook_Mid_Corr_Pts.jpg"
                          alt="Macbook Mid Correspondence Points"
                          width={700}
                          height={500}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">Mid</p>
                    </div>
                  </div>
                </div>

                {/* Set 2: Waywest Mid + Left */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-foreground mb-3">Waywest Mid + Left</h4>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="space-y-2">
                      <div className="aspect-[4/3] bg-muted rounded border border-border">
                        <Image
                          src="04_Waywest_Left_Corr_Pts.jpg"
                          alt="Waywest Left Correspondence Points"
                          width={700}
                          height={500}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">Left</p>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-[4/3] bg-muted rounded border border-border">
                        <Image
                          src="03_Waywest_Mid_Corr_Pts.jpg"
                          alt="Waywest Mid Correspondence Points"
                          width={700}
                          height={500}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">Mid</p>
                    </div>
                  </div>
                </div>

                {/* Recovered Homography Matrix */}
                <div className="space-y-6">
                  {/* Macbook Matrix */}
                  <div className="bg-muted/50 border border-border rounded-lg p-6">
                    <h4 className="text-base font-semibold text-foreground mb-3">H Matrix for Macbook Mid and Left Images</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border border-border p-3 text-center font-mono text-sm">0.81</td>
                            <td className="border border-border p-3 text-center font-mono text-sm">-0.05</td>
                            <td className="border border-border p-3 text-center font-mono text-sm">-175.15</td>
                          </tr>
                          <tr>
                            <td className="border border-border p-3 text-center font-mono text-sm">-0.13</td>
                            <td className="border border-border p-3 text-center font-mono text-sm">0.88</td>
                            <td className="border border-border p-3 text-center font-mono text-sm">126.48</td>
                          </tr>
                          <tr>
                            <td className="border border-border p-3 text-center font-mono text-sm">-0.00</td>
                            <td className="border border-border p-3 text-center font-mono text-sm">-0.00</td>
                            <td className="border border-border p-3 text-center font-mono text-sm">1.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Waywest Matrix */}
                  <div className="bg-muted/50 border border-border rounded-lg p-6">
                    <h4 className="text-base font-semibold text-foreground mb-3">H Matrix for Waywest Mid and Left Images</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="border border-border p-3 text-center font-mono text-sm">2.61</td>
                            <td className="border border-border p-3 text-center font-mono text-sm">-0.21</td>
                            <td className="border border-border p-3 text-center font-mono text-sm">-1284.09</td>
                          </tr>
                          <tr>
                            <td className="border border-border p-3 text-center font-mono text-sm">0.79</td>
                            <td className="border border-border p-3 text-center font-mono text-sm">2.10</td>
                            <td className="border border-border p-3 text-center font-mono text-sm">-510.29</td>
                          </tr>
                          <tr>
                            <td className="border border-border p-3 text-center font-mono text-sm">0.00</td>
                            <td className="border border-border p-3 text-center font-mono text-sm">-0.00</td>
                            <td className="border border-border p-3 text-center font-mono text-sm">1.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section A.3: Warp the Images */}
          <section id="a3" className="mb-20 scroll-mt-6">
            <h2 className="text-3xl font-bold text-foreground mb-6 pb-2 border-b border-border">
              A.3: Warp the Images
            </h2>

            <div className="space-y-8">
              {/* Background/Goals */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Background & Goals</h3>
                <p className="text-foreground leading-relaxed">
                  Once we have the homography matrix <strong>H</strong>, we use inverse warping to transform one image
                  into the coordinate frame of another. Inverse warping maps each destination pixel back to the source
                  image using <strong>H⁻¹</strong>, avoiding holes that would occur with forward warping. This approach
                  ensures every output pixel gets a value, though it requires interpolation since mapped coordinates are
                  typically non-integer.
                </p>
              </div>

              {/* Methods */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Methods</h3>
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    I implemented two interpolation methods from scratch:
                  </p>
                  <ul className="list-disc list-inside space-y-3 text-foreground leading-relaxed ml-4">
                    <li>
                      <strong>Nearest Neighbor:</strong> Rounds the mapped coordinates to the nearest integer pixel.
                      Fast but produces blocky artifacts, especially visible along edges and in smooth gradients.
                    </li>
                    <li>
                      <strong>Bilinear Interpolation:</strong> Computes a weighted average of the four surrounding
                      pixels based on fractional coordinates. Slower but produces smoother results with reduced
                      aliasing.
                    </li>
                  </ul>
                  <p className="text-foreground leading-relaxed mt-4">
                    To determine the output image size, I transformed the four corners of the source image through{" "}
                    <strong>H</strong> to find the bounding box. I also maintained an alpha mask to track valid pixels
                    and handle regions outside the source image bounds.
                  </p>
                </div>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Results</h3>

                {/* Interpolation Comparison */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-foreground mb-3">Interpolation Method Comparison</h4>
                  <div className="grid grid-cols-2 gap-6 mb-3">
                    <div className="space-y-2">
                      <div className="aspect-[4/3] bg-muted rounded border border-border">
                        <Image
                          src="02_Keyboard_-_Warped_(NN).jpg"
                          alt="Nearest Neighbor Warping"
                          width={700}
                          height={500}
                          className="w-full h-full object-cover rounded object-bottom"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">Nearest Neighbor - 1.80 secs</p>
                    </div>
                    <div className="space-y-2">
                      <div className="aspect-[4/3] bg-muted rounded border border-border">
                        <Image
                          src="02_Keyboard_-_Warped_(NN).jpg"
                          alt="Bilinear Interpolation Warping"
                          width={700}
                          height={500}
                          className="w-full h-full object-cover rounded object-bottom"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">Bilinear Interpolation - 4.68 sec</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-3">
                    Figure 3.1-3.2: Comparison of warping results using Nearest Neighbor (left) vs Bilinear
                    Interpolation (right) on the same homography transformation.
                  </p>
                  <div>
                    <p className="text-sm text-foreground leading-relaxed">
                      <strong>Quality vs Speed:</strong> Nearest neighbor is approximately ~2.5x faster but produces
                      visible blockiness. Bilinear interpolation adds minimal computational overhead while
                      improving visual quality, making it the preferred choice for final mosaics.
                    </p>
                  </div>
                </div>

                {/* Rectification Examples */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-foreground mb-3">Image Rectification Examples</h4>
                  <p className="text-foreground leading-relaxed mb-4">
                    Rectification demonstrates homography warping by transforming perspective-distorted planar surfaces
                    into fronto-parallel views. I manually selected four corners in the source image and mapped them to
                    a rectangular target frame.
                  </p>

                  {/* Example 1 */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-6 mb-3">
                      <div className="space-y-2">
                        <div className="aspect-[4/3] bg-muted rounded border border-border">
                          <Image
                            src="01_Keyboard_-_Source.jpg"
                            alt="Keyboard source image"
                            width={700}
                            height={500}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">Source</p>
                      </div>
                      <div className="space-y-2">
                        <div className="aspect-[4/3] bg-muted rounded border border-border">
                          <Image
                            src="02_Keyboard_-_Warped_(NN).jpg"
                            alt="Keyboard warped with nearest neighbor"
                            width={700}
                            height={500}
                            className="w-full h-full object-cover rounded object-bottom"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">Warped (NN)</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      Figure 3.3-3.4: Rectification of keyboard using nearest neighbor interpolation.
                    </p>
                  </div>

                  {/* Example 2 */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 gap-6 mb-3">
                      <div className="space-y-2">
                        <div className="aspect-[4/3] bg-muted rounded border border-border">
                          <Image
                            src="03_Student_Id_-_Source.jpg"
                            alt="Student ID source image"
                            width={700}
                            height={500}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">Source</p>
                      </div>
                      <div className="space-y-2">
                        <div className="aspect-[4/3] bg-muted rounded border border-border">
                          <Image
                            src="04_Student_Id_-_Warped_(Bilinear).jpg"
                            alt="Student ID warped with bilinear interpolation"
                            width={700}
                            height={500}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">Warped (Bilinear)</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      Figure 3.5-3.6: Rectification of student ID using bilinear interpolation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section A.4: Blend into a Mosaic */}
          <section id="a4" className="mb-20 scroll-mt-6">
            <h2 className="text-3xl font-bold text-foreground mb-6 pb-2 border-b border-border">
              A.4: Blend the Images into a Mosaic
            </h2>

            <div className="space-y-8">
              {/* Background/Goals */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Background & Goals</h3>
                <p className="text-foreground leading-relaxed">
                  After registering multiple images via homographies, we composite them into a unified mosaic. Simple
                  averaging in overlap regions often produces visible seams due to exposure differences and misalignment
                  artifacts. To create seamless panoramas, I implemented weighted blending techniques that smoothly
                  transition between images, reducing ghosting and visible boundaries.
                </p>
              </div>

              {/* Methods */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Methods</h3>
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    I built each mosaic in three main steps: align, warp, and blend.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-2">
                        1) Align (find how images relate).
                      </h4>
                      <p className="text-foreground leading-relaxed">
                        I first clicked matching points between overlapping image pairs (e.g., a corner or logo visible in both). Using these point pairs, I solved for a 3×3 "homography" that maps one image into the other. I chose the middle photo as the reference and computed homographies that send the left and right photos into the middle photo's view.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-2">
                        2) Warp into one canvas.
                      </h4>
                      <p className="text-foreground leading-relaxed">
                        Using those homographies, I projected (warped) each image into a shared "canvas." I computed the canvas size by transforming each image's four corners and taking the overall min/max bounds. Then I applied an integer translation so everything fits at positive coordinates. For sampling during the warp, I used bilinear interpolation (smooth, non-blocky resampling). I also kept a valid-pixel mask to know which warped pixels actually came from the source image.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-base font-semibold text-foreground mb-2">
                        3) Blend with feathering (weighted averaging).
                      </h4>
                      <p className="text-foreground leading-relaxed">
                        To avoid harsh seams, I made a simple per-image alpha map that is high (≈1) near the image center and gradually fades to 0 toward the edges. I warped each alpha map into the canvas the same way as the images. Finally, I combined all warped images by weighted averaging: accumulate (image × alpha) and divide by the sum of alphas. This "feathering" softens boundaries and reduces edge artifacts without heavy computation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Mosaic Results</h3>

                {/* Mosaic 1 */}
                <div className="mb-12 p-6">
                  <h4 className="text-lg font-medium text-foreground mb-4">Mosaic 1: Macbook</h4>

                  {/* Input thumbnails */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">Input Images:</p>
                    <div className="grid grid-cols-3 gap-3">
                      {["macbook_left.jpg", "macbook_mid.jpg", "macbook_right.jpg"].map((img, i) => (
                        <div key={i} className="aspect-video bg-muted round border border-border">
                          <Image
                            src={img}
                            alt={`Macbook input ${i + 1}`}
                            width={300}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final mosaic */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">Final Blended Mosaic:</p>
                    <div className="aspect-[21/9] bg-muted rounded border border-border">
                      <Image
                        src="05_Macbook_Mosaic.jpg"
                        alt="Macbook final mosaic"
                        width={1400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Mosaic 2 */}
                <div className="mb-12 p-6">
                  <h4 className="text-lg font-medium text-foreground mb-4">Mosaic 2: Berkeley Waywest</h4>

                  {/* Input thumbnails */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">Input Images:</p>
                    <div className="grid grid-cols-3 gap-3">
                      {["waywest_left.jpg", "waywest_mid.jpg", "waywest_right.jpg"].map((img, i) => (
                        <div key={i} className="aspect-video bg-muted rounded border border-border">
                          <Image
                            src={img}
                            alt={`Waywest input ${i + 1}`}
                            width={300}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final mosaic */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">Final Blended Mosaic:</p>
                    <div className="aspect-[21/9] bg-muted rounded border border-border">
                      <Image
                        src="06_Berkeley_Waywest_Mosaic.jpg"
                        alt="Waywest final mosaic"
                        width={1400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Mosaic 3 */}
                <div className="mb-12 p-6">
                  <h4 className="text-lg font-medium text-foreground mb-4">Mosaic 3: Cory Hall</h4>

                  {/* Input thumbnails */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">Input Images:</p>
                    <div className="grid grid-cols-3 gap-3">
                      {["cory_left.jpg", "cory_mid.jpg", "cory_right.jpg"].map((img, i) => (
                        <div key={i} className="aspect-video bg-muted rounded border border-border">
                          <Image
                            src={img}
                            alt={`Cory Hall input ${i + 1}`}
                            width={300}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final mosaic */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-foreground mb-2">Final Blended Mosaic:</p>
                    <div className="aspect-[21/9] bg-muted rounded border border-border">
                      <Image
                        src="07_Cory_Hall_Mosaic.jpg"
                        alt="Cory Hall final mosaic"
                        width={1400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Project 3B Header */}
          <div className="mt-24 mb-16 pt-12 border-t-2 border-border">
            <h1 className="text-4xl font-bold text-foreground mb-4">Project 3B: Feature Matching and Autostitching</h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground leading-relaxed">
                Building on Project 3A's manual correspondence approach, this project automates the panorama creation pipeline through feature detection and matching. I implement Harris corner detection to identify interest points, extract robust feature descriptors, match features across images using distance metrics, and apply RANSAC to estimate homographies while rejecting outliers for fully automatic image stitching.
              </p>
            </div>
          </div>

          {/* Section B.1: Harris Corner Detection */}
          <section id="b1" className="mb-20 scroll-mt-6">
            <h2 className="text-3xl font-bold text-foreground mb-6 pb-2 border-b border-border">
              B.1: Harris Corner Detection
            </h2>
            <div className="space-y-8">
              {/* Overview */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Overview</h3>
                <p className="text-foreground leading-relaxed">
                  To automate panorama stitching, we first detect interest points using the Harris corner detector, which identifies regions with strong intensity gradients in multiple directions. We then apply Adaptive Non-Maximal Suppression (ANMS) to select a spatially distributed subset of the strongest corners for robust feature matching.
                </p>
              </div>

              {/* Methodology */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Methodology</h3>
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    The corner detection pipeline consists of three main steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-foreground leading-relaxed ml-4">
                    <li>
                      <strong>Compute Harris Response:</strong> Calculate the Harris corner strength H(x, y) at each pixel by analyzing the eigenvalues of the structure tensor (computed from image gradients). Corners correspond to locations where both eigenvalues are large, indicating strong intensity changes in orthogonal directions.
                    </li>
                    <li>
                      <strong>Apply ANMS:</strong> For each detected corner point x<sub>i</sub> with response strength f(x<sub>i</sub>), compute its suppression radius r<sub>i</sub> as the minimum distance to any stronger corner within a robustness threshold. This ensures spatially well-distributed features across the image.
                    </li>
                    <li>
                      <strong>Select Top Features:</strong> Sort corners by their suppression radius r<sub>i</sub> in descending order and retain the top 500 points with the largest radii, ensuring wide spatial coverage while maintaining strong corner responses.
                    </li>
                  </ol>

                  {/* ANMS Equation Block */}
                  <div className="bg-muted/50 border border-border rounded-lg p-6 my-6">
                    <h4 className="text-base font-semibold text-foreground mb-3">ANMS Suppression Radius</h4>
                    <div className="space-y-3 text-foreground">
                      <p className="text-sm">For each corner x<sub>i</sub> with response f(x<sub>i</sub>):</p>
                      <div className="bg-background p-4 rounded border border-border font-mono text-sm">
                        <p>r<sub>i</sub> = min<sub>j</sub> |x<sub>i</sub> − x<sub>j</sub>|,&nbsp;&nbsp;s.t.&nbsp;&nbsp;f(x<sub>i</sub>) &lt; c<sub>robust</sub> · f(x<sub>j</sub>),&nbsp;&nbsp;x<sub>j</sub> ∈ I</p>
                      </div>
                      <p className="text-sm mt-4">
                        where c<sub>robust</sub> = 0.9 controls the robustness threshold, ensuring that only significantly stronger corners suppress nearby weaker ones.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Results</h3>
                <p className="text-foreground leading-relaxed mb-6">
                  Below we compare the raw Harris corners (thousands of detections) with the ANMS-refined set (500 points). ANMS dramatically reduces the number of features while maintaining spatial distribution and corner strength.
                </p>

                {/* Harris Corners without ANMS */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-foreground mb-4">Harris Corners (Before ANMS)</h4>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    {[
                      { img: "01_Harris_Corners_Macbook_Mid.jpg", title: "Harris Corners: Macbook Mid" },
                      { img: "02_Harris_Corners_Berkeley_Waywest_Mid.jpg", title: "Harris Corners: Berkeley Waywest Mid" },
                      { img: "03_Harris_Corners_Cory_Hall_Mid.jpg", title: "Harris Corners: Cory Hall Mid" },
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="aspect-[4/3] bg-muted rounded border border-border flex items-center justify-center">
                          <Image
                            src={item.img}
                            alt={item.title}
                            width={600}
                            height={450}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">{item.title}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Harris Corners with ANMS */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-foreground mb-4">ANMS-selected Corners (Top 500)</h4>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    {[
                      { img: "04_ANMS-selected_Corners_Macbook_Mid.jpg", title: "ANMS-selected Corners: Macbook Mid" },
                      { img: "05_ANMS-selected_Corners_Berkeley_Waywest_Mid.jpg", title: "ANMS-selected Corners: Berkeley Waywest Mid" },
                      { img: "06_ANMS-selected_Corners_Cory_Hall_Mid.jpg", title: "ANMS-selected Corners: Cory Hall Mid" },
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="aspect-[4/3] bg-muted rounded border border-border flex items-center justify-center">
                          <Image
                            src={item.img}
                            alt={item.title}
                            width={600}
                            height={450}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground text-center">{item.title}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    Figure B.1.1-B.1.6: Comparison showing raw Harris corner detections (top row) versus the refined 500 ANMS-selected corners (bottom row) with improved spatial distribution.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section B.2: Feature Descriptor Extraction */}
          <section id="b2" className="mb-20 scroll-mt-6">
            <h2 className="text-3xl font-bold text-foreground mb-6 pb-2 border-b border-border">
              B.2: Feature Descriptor Extraction
            </h2>
            <div className="space-y-8">
              {/* Overview */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Overview</h3>
                <p className="text-foreground leading-relaxed">
                  For each detected corner, we extract a distinctive feature descriptor by sampling a local image patch around the interest point. These axis-aligned 8×8 descriptors capture local intensity patterns for matching corresponding features across images, without considering scale or rotation invariance for this implementation.
                </p>
              </div>

              {/* Methodology */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Methodology</h3>
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    Feature extraction follows a three-step process:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-foreground leading-relaxed ml-4">
                    <li>
                      <strong>Sample 40×40 window:</strong> Extract a larger patch centered on each ANMS corner point using bilinear interpolation. Apply Gaussian pre-blur (σ ≈ 1) to reduce aliasing artifacts during downsampling.
                    </li>
                    <li>
                      <strong>Downsample to 8×8:</strong> Resize the 40×40 patch down to an 8×8 descriptor, preserving local structure while achieving a compact representation for efficient matching.
                    </li>
                    <li>
                      <strong>Bias/Gain normalize:</strong> Standardize each descriptor by subtracting its mean (bias) and dividing by standard deviation (gain), ensuring robustness to illumination changes.
                    </li>
                  </ol>
                </div>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Results</h3>
                <p className="text-foreground leading-relaxed mb-6">
                  Below are 12 sample 8×8 feature descriptors extracted from detected corners. Each patch represents the normalized local intensity pattern around an interest point:
                </p>

                {/* Patch Grid (3 rows x 4 cols) */}
                <div className="mb-8">
                  <div className="grid grid-cols-4 gap-4 mb-3">
                    {Array.from({ length: 12 }, (_, i) => ({
                      img: `${String(i + 7).padStart(2, '0')}_Patch_${i}.jpg`,
                    })).map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="aspect-square bg-muted rounded border border-border flex items-center justify-center">
                          <Image
                            src={item.img}
                            alt={`Feature descriptor patch ${i}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    Figure B.2.1: Sample of 12 extracted 8×8 feature descriptors after bias/gain normalization.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section B.3: Feature Matching */}
          <section id="b3" className="mb-20 scroll-mt-6">
            <h2 className="text-3xl font-bold text-foreground mb-6 pb-2 border-b border-border">
              B.3: Feature Matching
            </h2>
            <div className="space-y-8">
              {/* Overview */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Overview</h3>
                <p className="text-foreground leading-relaxed">
                  Once feature descriptors are extracted, we match corresponding points between image pairs by finding descriptors with similar intensity patterns. Using Lowe's ratio test, we filter matches to retain only distinctive correspondences, reducing false positives for robust homography estimation.
                </p>
              </div>

              {/* Methodology */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Methodology</h3>
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    For each descriptor in the first image, we compute Euclidean distances to all descriptors in the second image. We identify the nearest (best) and second-nearest matches. A match is accepted only if the ratio of best to second-best distance is below a threshold (ratio = 0.5), ensuring distinctiveness. Feature extraction uses a 40×40 window with 5-pixel sampling spacing and Gaussian blur (σ = 1.0) before descriptor computation.
                  </p>
                </div>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Results</h3>
                <p className="text-foreground leading-relaxed mb-6">
                  Below are tentative feature matches between the Macbook image pairs before RANSAC filtering. Each line connects a matched feature pair:
                </p>

                {/* Match visualizations */}
                <div className="space-y-8">
                  {/* Macbook Mid-Left */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-foreground mb-3">Macbook Matches: Mid &lt;--&gt; Left</h4>
                    <div className="p-4">
                      <Image
                        src="macbook_matches_mid_left.png"
                        alt="Macbook Matches: Mid <--> Left"
                        width={1200}
                        height={600}
                        className="w-full h-auto object-contain rounded"
                      />
                    </div>
                  </div>

                  {/* Macbook Mid-Right */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-foreground mb-3">Macbook Matches: Mid &lt;--&gt; Right</h4>
                    <div className="p-4">
                      <Image
                        src="macbook_matches_mid_right.png"
                        alt="Macbook Matches: Mid <--> Right"
                        width={1200}
                        height={600}
                        className="w-full h-auto object-contain rounded"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground italic">
                    Figure B.3.1-B.3.2: Feature matches between image pairs using Lowe's ratio test (ratio = 0.5). Green dots mark detected features, red lines connect matched pairs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section B.4: RANSAC for Robust Homography */}
          <section id="b4" className="mb-20 scroll-mt-6">
            <h2 className="text-3xl font-bold text-foreground mb-6 pb-2 border-b border-border">
              B.4: RANSAC for Robust Homography
            </h2>
            <div className="space-y-8">
              {/* Overview */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Overview</h3>
                <p className="text-foreground leading-relaxed">
                  Feature matching produces correspondences that may include outliers from incorrect matches. RANSAC (Random Sample Consensus) robustly estimates the homography by iteratively fitting models to random subsets and identifying inliers, enabling fully automatic panorama stitching without manual point selection.
                </p>
              </div>

              {/* Methodology */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Methodology</h3>
                <div className="space-y-4">
                  <p className="text-foreground leading-relaxed">
                    After obtaining tentative feature matches from Section B.3, we apply 4-point RANSAC to compute a robust homography estimate:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-foreground leading-relaxed ml-4">
                    <li>
                      <strong>Select four feature pairs at random:</strong> Randomly sample 4 correspondence pairs from the tentative matches. Four points provide the minimum needed to compute an exact homography.
                    </li>
                    <li>
                      <strong>Compute homography H (exact):</strong> Solve for the 3×3 homography matrix using these 4 point pairs through the least-squares method from Part A.
                    </li>
                    <li>
                      <strong>Compute inliers:</strong> For each tentative match (p<sub>i</sub>, p<sub>i</sub>&apos;), calculate the reprojection error dist(p<sub>i</sub>&apos;, Hp<sub>i</sub>). Mark it as an inlier if the distance is below threshold ε (typically 1-3 pixels).
                    </li>
                    <li>
                      <strong>Keep largest set of inliers:</strong> Track the iteration that produces the maximum number of inliers. This represents the best consensus model.
                    </li>
                    <li>
                      <strong>Re-compute least-squares H estimate:</strong> After completing all RANSAC iterations, recompute the homography using all inliers from the best model for a refined estimate.
                    </li>
                  </ol>
                  <p className="text-foreground leading-relaxed mt-4">
                    Once robust homographies are computed between image pairs, we apply the warping and blending pipeline from Part A to create fully automatic panoramic mosaics.
                  </p>
                </div>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Results</h3>
                <p className="text-foreground leading-relaxed mb-6">
                  Below we compare manually-stitched mosaics from Part A (left) with automatically-stitched mosaics using feature detection and RANSAC (right). The automatic pipeline produces comparable quality without requiring manual correspondence selection:
                </p>

                {/* Mosaic 1: Macbook */}
                <div className="mb-12">
                  <h4 className="text-lg font-medium text-foreground mb-4">Mosaic 1: Macbook</h4>
                  <div className="grid grid-cols-2 gap-6 mb-3">
                    <div className="space-y-2">
                      <div className="bg-muted rounded border border-border">
                        <Image
                          src="05_Macbook_Mosaic.jpg"
                          alt="Macbook Manual Mosaic"
                          width={1400}
                          height={800}
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center font-medium">Manual Stitching</p>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-muted rounded border border-border">
                        <Image
                          src="macbook_mosaic_auto.png"
                          alt="Macbook Automatic Mosaic"
                          width={1400}
                          height={800}
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center font-medium">Automatic Stitching</p>
                      <p className="text-xs text-muted-foreground text-center italic">Execution time: 1.5956 secs</p>
                    </div>
                  </div>
                </div>

                {/* Mosaic 2: Berkeley Waywest */}
                <div className="mb-12">
                  <h4 className="text-lg font-medium text-foreground mb-4">Mosaic 2: Berkeley Waywest</h4>
                  <div className="grid grid-cols-2 gap-6 mb-3">
                    <div className="space-y-2">
                      <div className="bg-muted rounded border border-border">
                        <Image
                          src="06_Berkeley_Waywest_Mosaic.jpg"
                          alt="Berkeley Waywest Manual Mosaic"
                          width={1400}
                          height={800}
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center font-medium">Manual Stitching</p>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-muted rounded border border-border">
                        <Image
                          src="waywest_mosaic_auto.png"
                          alt="Berkeley Waywest Automatic Mosaic"
                          width={1400}
                          height={800}
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center font-medium">Automatic Stitching</p>
                      <p className="text-xs text-muted-foreground text-center italic">Execution time: 3.2566 secs</p>
                    </div>
                  </div>
                </div>

                {/* Mosaic 3: Cory Hall */}
                <div className="mb-12">
                  <h4 className="text-lg font-medium text-foreground mb-4">Mosaic 3: Cory Hall</h4>
                  <div className="grid grid-cols-2 gap-6 mb-3">
                    <div className="space-y-2">
                      <div className="bg-muted rounded border border-border">
                        <Image
                          src="07_Cory_Hall_Mosaic.jpg"
                          alt="Cory Hall Manual Mosaic"
                          width={1400}
                          height={800}
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center font-medium">Manual Stitching</p>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-muted rounded border border-border">
                        <Image
                          src="cory_mosaic_auto.png"
                          alt="Cory Hall Automatic Mosaic"
                          width={1400}
                          height={800}
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground text-center font-medium">Automatic Stitching</p>
                      <p className="text-xs text-muted-foreground text-center italic">Execution time: 2.3880 secs</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground italic">
                  Figure B.4.1-B.4.6: Comparison of manual (Part A) versus automatic (Part B) panorama stitching. The automatic pipeline using Harris corners, feature descriptors, Lowe's ratio matching, and RANSAC produces high-quality mosaics without manual intervention.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
