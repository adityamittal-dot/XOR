FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# psycopg[binary] and pdfplumber ship wheels, so no compiler toolchain is needed.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN adduser --disabled-password --gecos "" appuser \
 && mkdir -p /app/media /app/staticfiles \
 && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
# WEB_CONCURRENCY is set by Render based on the instance's actual CPU
# allotment; a hardcoded worker count would ignore that and over- or
# under-provision. The explicit `exec` hands gunicorn PID 1 so it still
# receives Docker/Render's shutdown signal directly, same as before.
CMD ["sh", "-c", "exec gunicorn XOR.wsgi:application --bind 0.0.0.0:8000 --workers ${WEB_CONCURRENCY:-2} --timeout 120"]
