var ELFSpec = [
  { name: "ELF Header", fields: [
      { name: "EI_MAG", format: "ASCII", size: 4 },
      { name: "EI_CLASS", size: DataReader.x86StorageSizeENUM.BYTE },
      { name: "EI_DATA", size: DataReader.x86StorageSizeENUM.BYTE },
      { name: "EI_VERSION", size: DataReader.x86StorageSizeENUM.BYTE },
      { name: "EI_OSABI", size: DataReader.x86StorageSizeENUM.BYTE },
      { name: "EI_ABIVERSION", size: DataReader.x86StorageSizeENUM.BYTE },
      { name: "EI_PAD", skip: 7 },
      "e_type",
      "e_machine",
      { name: "e_version", size: 4 },
      { name: "e_entry", size: function() { return ((this.EI_CLASS-1) ? 8 : 4); } },
      { name: "e_phoff", size: function() { return ((this.EI_CLASS-1) ? 8 : 4); } },
      { name: "e_shoff", size: function() { return ((this.EI_CLASS-1) ? 8 : 4); } },
      { name: "e_flags", size: 4 },
      "e_ehsize",
      "e_phentsize",
      "e_phnum",
      "e_shentsize",
      "e_shnum",
      "e_shstrndx"
  ]}
];
