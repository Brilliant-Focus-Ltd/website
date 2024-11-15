{
  description = "Logo Animation v2";

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
        
        watchJs = pkgs.writeShellScriptBin "watch-js" ''
          ${pkgs.esbuild}/bin/esbuild \
            static/js/src/main.ts \
            --bundle \
            --watch \
            --outfile=static/js/script.js
        '';
        
        dev = pkgs.writeShellScriptBin "dev" ''
          ${buildJs}/bin/build-js
          ${pkgs.zola}/bin/zola serve --interface 0.0.0.0
        '';
        
        build = pkgs.writeShellScriptBin "build" ''
          ${buildJs}/bin/build-js
          ${pkgs.zola}/bin/zola build
        '';
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            zola
            nodejs
            typescript
            esbuild
            typescript-language-server
            buildJs
            watchJs
            dev
            build
          ];

          shellHook = ''
            echo "🚀 Development environment ready!"
            echo "Commands: dev, build, build-js, watch-js"
          '';
        };

        packages.default = pkgs.stdenv.mkDerivation {
          name = "logo-animation";
          src = ./.;
          
          buildInputs = with pkgs; [
            zola
            nodejs
            esbuild
          ];

          buildPhase = ''
            ${buildJs}/bin/build-js
            ${pkgs.zola}/bin/zola build
          '';

          installPhase = ''
            cp -r public $out
          '';
        };
      }
    );
}
