import Image from "next/image"

type BannerProps = {
	className?: string
	title?: string
	subtitle?: string
	imageUrl?: string
}

export function ClientBanner({ className, title, subtitle, imageUrl }: BannerProps) {
	return (
		<section
			className={[
				"flex w-full flex-col rounded-3xl bg-[#1A1B1F] px-6 py-10 text-white",
				"shadow-[0_20px_80px_rgba(0,0,0,.55)] md:flex-row md:items-center md:justify-between",
				"md:px-10 md:py-12 lg:px-16 lg:py-14",
				className,
			]
				.filter(Boolean)
				.join(" ")}
		>
			<div className="order-2 flex-1 space-y-6 md:order-1">
		

				<header className="space-y-3">
					<h2 className="text-3xl font-semibold leading-tight tracking-tight text-balance md:text-4xl">
						{title}
					</h2>
					<p className="text-base text-white/70 md:text-lg">
						{subtitle}
					</p>
				</header>

			
			</div>
			
			<div className="order-1 mb-6 flex justify-center md:order-2 md:mb-0">
				<div className="relative h-56 w-full max-w-xs flex-shrink-0 md:h-72 md:max-w-none md:w-[420px]">
					<Image
						src={imageUrl ?? "/cartoonH.png"}
						alt="Profissional organizando agenda em um notebook"
						fill
						sizes="(max-width: 767px) 320px, 420px"
						className="object-contain"
						priority
					/>
				</div>
			</div>
		</section>
	)
}
