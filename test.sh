export K8S_CLUSTER_CA_CERTIFICATE="-----BEGIN CERTIFICATE-----
MIIELTCCApWgAwIBAgIRAKvx+cZCKAoIDXQAco2jwb0wDQYJKoZIhvcNAQELBQAw
LzEtMCsGA1UEAxMkMGUxNWY5YjktMmMyMi00MmUwLTgxZWQtYmVlYjFhZmNlMzYw
MCAXDTI0MDgyMTA3NDYwNFoYDzIwNTQwODE0MDg0NjA0WjAvMS0wKwYDVQQDEyQw
ZTE1ZjliOS0yYzIyLTQyZTAtODFlZC1iZWViMWFmY2UzNjAwggGiMA0GCSqGSIb3
DQEBAQUAA4IBjwAwggGKAoIBgQCmxMPa5pGDbU+PgqV1mha78H0kcbGzSEQe2X28
aFehbQgR2rTw9x1/wPWmTpbMCRr25pbuJ8wrsvh1V6sLvZ8ErN1zlQqNxzxh4Jd6
wB9U14CBD71ks9oteAY+4w4u9SchQCWmmpa89s3C12TwmrD6MZuzRBG1t4K7mzHA
gjqCX/FVr6m+Sd2d9job2joaZi9QMt/JhemcMMDz4+w0fL6aGfCxRUKtNu0T8wBm
3fxQEtokccCp4DZtdM7GPUp/U484RAeLo69T9sV37Ik3EPm4kmr1jrXmZ1Ibu2XV
RRxGAihKNwAKNpy1T8sfOa12/arZi1vaKP+aUq9FbljviTbEIF8BNUYCYGeShEZD
C9ebNgrOisRqR1/BkrdHEmqUIAhGjaq+CHwyH+UzHaSO2rBAjg2IyIR1ciikuUJM
ys6Q3jYY1czw0sTPhTASeq48SQcvf1IKB/KM4GAE1GqHu0d1PdnMewKmSos7VD8L
dmAvRoBFdqlWo8aRb5hId84VcYMCAwEAAaNCMEAwDgYDVR0PAQH/BAQDAgIEMA8G
A1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFP0thDgiSdihyHkc0sMFtun8xV+ZMA0G
CSqGSIb3DQEBCwUAA4IBgQCFwkwFxyMvFSSNORMGKGA5GR7T6luYSqlEiFg1Ut3h
Gle/HTABXC6RMaykKmOGOHE2c5QSzY6YR4rYEBjII6clMCP6H+8nhd5bU577Ra/K
aHYWUllaAkiiyt4N/RkMX8RbQkvRUMptbjG+QMpdCxK9feeoK3GrMOPhyChGJWla
RrtK0LR95Cv1DTF3vq5sIK4HNAZxgXlTf8zLVD6FaNf0Qv0GAP0AFKSWMY2xvaXg
lSSxAl+AtS1oKxYFNu7HItyF+yBSc9czISpnzw6QvZX283ElbdRr4sJikkDThT7c
bI1GPMCt0C9gK6vBjIA0v/PXIxkykDXE5nxJ+nomTu6JDjNfRYbkXDPQPH8Ab0mq
AizZdiUQHuQmcqkoah3L69Rin3Yq0nHAMHNhfo4YkrHqjRgwJG9VQQwc/uHAV7Ma
P81Vd1dWUMXUr+x7et0bRqHQZ2jSFt60P9fhzb5406zZnHKAZA0PxBsGTp0LmI1y
+RaiXE8fFS9G/9bpjabuirY=
-----END CERTIFICATE-----"

export K8S_ACCESS_TOKEN="jPY/9zINvJabsAbvJeVEfBqpYgBsf7twSp9U9i8ZaDo="

kubectl --server=https://34.75.38.234 --token=$K8S_ACCESS_TOKEN --certificate-authority=$K8S_CLUSTER_CA_CERTIFICATE get nodes
