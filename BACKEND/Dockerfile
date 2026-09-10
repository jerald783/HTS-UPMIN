# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy and restore cleanly
COPY *.csproj ./
RUN dotnet restore

# Copy everything else
COPY . .

# Explicitly target BACKEND.csproj instead of the .sln file, and clear stale caches
RUN dotnet publish BACKEND.csproj -c Release -o /app --no-restore --no-cache

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app .

# Create the missing directories so Program.cs doesn't crash
RUN mkdir -p Assets/ChatFiles

# Fix for Linux SegFaults (Exit 139) in container runtimes
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1

EXPOSE 8080
ENTRYPOINT ["dotnet", "BACKEND.dll"]