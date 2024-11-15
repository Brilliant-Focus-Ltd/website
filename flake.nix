{
  description = "Logo Animation Development";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        
        buildJs = pkgs.writeShellScriptBin "build-js" ''
          ${pkgs.esbuild}/bin/esbuild \
            static/js/src/main.ts \
            --bundle \
            --minify \
            --outfile=static/js/script.js
        '';
      in {
        packages.default = pkgs.stdenv.mkDerivation {
          name = "logo-animation";
          src = ./.;
          
          buildInputs = with pkgs; [
            zola
            nodejs
            esbuild
            typescript
          ];
          
          buildPhase = ''
            ${buildJs}/bin/build-js
            ${pkgs.zola}/bin/zola build
          '';

	  installPhase = ''
            mkdir -p $out
            cp -r public/* $out/
          '';
          
        };
      });
}
