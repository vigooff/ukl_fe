export default function DetailPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#23262F] to-[#181A20] py-10 px-4">
			<div className="bg-[#181A20] rounded-xl shadow-xl max-w-2xl w-full p-8">
				<div className="flex flex-col md:flex-row gap-6 items-center">
					<img
						src="/default-thumbnail.jpg"
						alt="Judul Lagu"
						className="w-48 h-48 object-cover rounded-lg shadow-md border border-[#23262F]"
					/>
					<div className="flex-1">
						<h1 className="text-3xl font-bold mb-2 text-[#F3F4F6]">Judul Lagu</h1>
						<p className="text-xl text-[#A1A1AA] mb-2">Nama Artis</p>
						<p className="text-[#F3F4F6] mb-4">Deskripsi lagu atau informasi tambahan tentang lagu ini.</p>
						<audio controls className="w-full mt-2">
							<source src="/audio-sample.mp3" />
							Your browser does not support the audio element.
						</audio>
						<div className="mt-4">
							<span className="text-[#7EE787] font-semibold">Likes: </span>
							<span className="text-[#F3F4F6]">123</span>
						</div>
					</div>
				</div>
				<div className="mt-8">
					<h2 className="text-lg font-bold mb-4 text-[#7EE787]">Comments (2)</h2>
					<div className="space-y-3 max-h-60 overflow-y-auto pr-1">
						<div className="bg-[#23262F] p-3 rounded-lg">
							<div className="flex justify-between items-start mb-1">
								<span className="font-medium text-sm text-[#F3F4F6]">User1</span>
								<span className="text-xs text-[#A1A1AA]">2025-08-22</span>
							</div>
							<p className="text-sm text-[#F3F4F6]">Lagu ini keren banget!</p>
						</div>
						<div className="bg-[#23262F] p-3 rounded-lg">
							<div className="flex justify-between items-start mb-1">
								<span className="font-medium text-sm text-[#F3F4F6]">User2</span>
								<span className="text-xs text-[#A1A1AA]">2025-08-21</span>
							</div>
							<p className="text-sm text-[#F3F4F6]">Suka banget sama aransemen musiknya.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
