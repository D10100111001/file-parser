var PESpec = {
    meta: {endianness: DataReader.EndiannessENUM.LITTLE_ENDIAN},
    spec: [
        {
            name: "DOS Header", fields: [
            {name: "magic", format: "ASCII"},
            "usedBytesInLastPage",
            "fileSizeInPages",
            "numRelocationItems",
            "headerSizeInParagraphs",
            "minExtraParagraphs",
            "maxExtraParagraphs",
            "initialSS",
            "initialSP",
            "checksum",
            "initialIP",
            "initialRelativeCS",
            "addressOfRelocationTable",
            "overlayNumber",
            {name: "reserved", count: 4},
            "oemId",
            "oemInfo",
            {name: "reserved2", count: 10},
            {name: "addressOfNewExeHeader", size: DataReader.x86StorageSizeENUM.DWORD},
            {
                name: "stubSize", process: function () {
	                var stubSize = this.DOSHeader.fileSizeInPages * 512 - (512 - this.DOSHeader.usedBytesInLastPage);
	                if (stubSize > this.DOSHeader.addressOfNewExeHeader)
	                    stubSize = this.DOSHeader.addressOfNewExeHeader;
	                stubSize -= this.DOSHeader.headerSizeInParagraphs * 16;
	                return stubSize;
	            }, size: null
            }
        ]
        },
        {
            name: "DOS Stub", fields: [
            {
                name: "stub", size: DataReader.x86StorageSizeENUM.BYTE, count: function () {
                	return this.DOSHeader.stubSize;
            	}
            }
        ]
        },
        {
            name: "PE Header", fields: [
            {name: "Signature", skipTo: function() { return this.DOSHeader.addressOfNewExeHeader; }, size: DataReader.x86StorageSizeENUM.DWORD, format: "ASCII"}
        ]
        },
        {
            name: "COFF Header", fields: [
            {
                name: "Machine", map: {
					0x14c: "Intel 386",
					0x8664: "x64",
					0x162: "MIPS R3000",
					0x168: "MIPS R10000",
					0x169: "MIPS little endian WCI v2",
					0x183: "old Alpha AXP",
					0x184: "Alpha AXP",
					0x1a2: "Hitachi SH3",
					0x1a3: "Hitachi SH3 DSP",
					0x1a6: "Hitachi SH4",
					0x1a8: "Hitachi SH5",
					0x1c0: "ARM little endian",
					0x1c2: "Thumb",
					0x1d3: "Matsushita AM33",
					0x1f0: "PowerPC little endian",
					0x1f1: "PowerPC with floating point support",
					0x200: "Intel IA64",
					0x266: "MIPS16",
					0x268: "Motorola 68000 series",
					0x284: "Alpha AXP 64-bit",
					0x366: "MIPS with FPU",
					0x466: "MIPS16 with FPU",
					0xebc: "EFI Byte Code",
					0x8664: "AMD AMD64",
					0x9041: "Mitsubishi M32R little endian",
					0xc0ee: "clr pure MSIL"
	            }
            },
            "NumberOfSections",
            {name: "TimeDateStamp", size: DataReader.x86StorageSizeENUM.DWORD, format: "DATE"},
            {name: "PointerToSymbolTable", size: DataReader.x86StorageSizeENUM.DWORD},
            {name: "NumberOfSymbols", size: DataReader.x86StorageSizeENUM.DWORD},
            "SizeOfOptionalHeader",
            {
				name: "Characteristics", flag: {
					0x02: "Executable file",
					0x100: "32-BIT Machine file",
					0x200: "file is non-relocatable (addresses are absolute, not RVA)",
					0x2000: "File is a DLL Library, not an EXE"
				}
			}

        ]
        },
		{
			name: "PE Optional Header", fields: [
				{ name: "signature", map: { 0x10b: "32 bit executable image.", 0x20b: "64 bit executable image", 0x107: "ROM image" } }, //decimal number 267 for 32 bit, 523 for 64 bit, and 263 for a ROM image.
				{ name: "MajorLinkerVersion", size: DataReader.x86StorageSizeENUM.BYTE },
				{ name: "MinorLinkerVersion", size: DataReader.x86StorageSizeENUM.BYTE },
				{ name: "SizeOfCode", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "SizeOfInitializedData", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "SizeOfUninitializedData", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "AddressOfEntryPoint", size: DataReader.x86StorageSizeENUM.DWORD },  //The RVA of the code entry point
				{ name: "BaseOfCode", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "BaseOfData", size: DataReader.x86StorageSizeENUM.DWORD },
					/*The next 21 fields are an extension to the COFF optional header format*/
				{ name: "ImageBase", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "SectionAlignment", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "FileAlignment", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "MajorOSVersion" },
				{ name: "MinorOSVersion" },
				{ name: "MajorImageVersion" },
				{ name: "MinorImageVersion" },
				{ name: "MajorSubsystemVersion" },
				{ name: "MinorSubsystemVersion" },
				{ name: "Win32VersionValue", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "SizeOfImage", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "SizeOfHeaders", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "Checksum", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "Subsystem", map: {
					0: "Unknown subsystem",
					1: "No subsystem required (device drivers and native system processes)",
					2: "Windows graphical user interface (GUI) subsystem",
					3: "Windows character-mode user interface (CUI) subsystem",
					5: "OS/2 CUI subsystem",
					7: "POSIX CUI subsystem",
					9: "Windows CE system",
					10: "Extensible Firmware Interface (EFI) application",
					11: "EFI driver with boot services",
					12: "EFI driver with process-time services",
					13: "EFI ROM image",
					14: "Xbox system",
					16: "Boot application"
				}},
				{ name: "DLLCharacteristics", flag: {
					0x0001: "Reserved",
					0x0002: "Reserved",
					0x0004: "Reserved",
					0x0008: "Reserved",
					0x0040: "The DLL can be relocated at load time",
					0x0080: "Code integrity checks are forced",
					0x0100: "The image is compatible with data execution prevention (DEP)",
					0x0200: "The image is isolation aware, but should not be isolated",
					0x0400: "The image does not use structured exception handling (SEH). No handlers can be called in this image",
					0x0800: "Do not bind the image",
					0x1000: "Reserved",
					0x2000: "A WDM driver",
					0x4000: "Reserved",
					0x8000: "The image is terminal server aware"
				} },
				{ name: "SizeOfStackReserve", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "SizeOfStackCommit", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "SizeOfHeapReserve", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "SizeOfHeapCommit", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "LoaderFlags", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "NumberOfRvaAndSizes", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "DataDirectory", count: function() { return this.PEOptionalHeader.NumberOfRvaAndSizes; }, names: [
					"Export Directory",
					"Import Directory",
					"Resource Directory",
					"Exception Directory",
					"Security Directory",
					"Base Relocation Table",
					"Debug Directory",
					"Architecture specific data",
					"Global pointer register relative virtual address",
					"Thread Local Storage directory",
					"Load Configuration directory",
					"Bound Import directory",
					"Import Address Table",
					"Delay Import table",
					"COM descriptor table",
					"Reserved"
				], fields: [
					{name: "VirtualAddress", size: DataReader.x86StorageSizeENUM.DWORD},
					{name: "Size", size: DataReader.x86StorageSizeENUM.DWORD},
				] }
		]
		},
		{
			name: "SectionHeaders", fields: [
			{ name: "Headers", count: function() { return this.COFFHeader.NumberOfSections; }, names: [], fields: [
				{ name: "SectionName", count: 8, size: DataReader.x86StorageSizeENUM.BYTE, format: "ASCII" },
				{ name: "Size", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "RVA", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "PhysicalSize", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "PhysicalLocation", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "PointerToRelocations", size: DataReader.x86StorageSizeENUM.DWORD },
				{ name: "PointerToLineNumbers", size: DataReader.x86StorageSizeENUM.DWORD },
				"NumberOfRelocations",
				"NumberOfLineNumbers",
				{ name: "Characteristics", size: DataReader.x86StorageSizeENUM.DWORD, flag: {
					0x00000008: "IMAGE_SCN_TYPE_NO_PAD",
					0x00000020: "IMAGE_SCN_CNT_CODE",
					0x00000040: "IMAGE_SCN_CNT_INITIALIZED_DATA",
					0x00000080: "IMAGE_SCN_CNT_UNINITIALIZED_DATA",
					0x00000100: "IMAGE_SCN_LNK_OTHER",
					0x00000200: "IMAGE_SCN_LNK_INFO",
					0x00000800: "IMAGE_SCN_LNK_REMOVE",
					0x00001000: "IMAGE_SCN_LNK_COMDAT",
					0x00004000: "IMAGE_SCN_NO_DEFER_SPEC_EXC",
					0x00008000: "IMAGE_SCN_GPREL",
					0x00008000: "IMAGE_SCN_MEM_FARDATA",
					0x00020000: "IMAGE_SCN_MEM_PURGEABLE",
					0x00020000: "IMAGE_SCN_MEM_16BIT",
					0x00040000: "IMAGE_SCN_MEM_LOCKED",
					0x00080000: "IMAGE_SCN_MEM_PRELOAD",
					0x00100000: "IMAGE_SCN_ALIGN_1BYTES",
					0x00200000: "IMAGE_SCN_ALIGN_2BYTES",
					0x00300000: "IMAGE_SCN_ALIGN_4BYTES",
					0x00400000: "IMAGE_SCN_ALIGN_8BYTES",
					0x00500000: "IMAGE_SCN_ALIGN_16BYTES",
					0x00600000: "IMAGE_SCN_ALIGN_32BYTES",
					0x00700000: "IMAGE_SCN_ALIGN_64BYTES",
					0x00800000: "IMAGE_SCN_ALIGN_128BYTES",
					0x00900000: "IMAGE_SCN_ALIGN_256BYTES",
					0x00A00000: "IMAGE_SCN_ALIGN_512BYTES",
					0x00B00000: "IMAGE_SCN_ALIGN_1024BYTES",
					0x00C00000: "IMAGE_SCN_ALIGN_2048BYTES",
					0x00D00000: "IMAGE_SCN_ALIGN_4096BYTES",
					0x00E00000: "IMAGE_SCN_ALIGN_8192BYTES",
					0x00F00000: "IMAGE_SCN_ALIGN_MASK",
					0x01000000: "IMAGE_SCN_LNK_NRELOC_OVFL",
					0x02000000: "IMAGE_SCN_MEM_DISCARDABLE",
					0x04000000: "IMAGE_SCN_MEM_NOT_CACHED",
					0x08000000: "IMAGE_SCN_MEM_NOT_PAGED",
					0x10000000: "IMAGE_SCN_MEM_SHARED",
					0x20000000: "IMAGE_SCN_MEM_EXECUTE",
					0x40000000: "IMAGE_SCN_MEM_READ",
					0x80000000: "IMAGE_SCN_MEM_WRITE"
				}}
			]}
		]
		}
    ]
};
